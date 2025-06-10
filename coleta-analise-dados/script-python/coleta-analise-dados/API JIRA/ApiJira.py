import time
import os
from jira.client import JIRA
import mysql.connector
from dotenv import load_dotenv

# Carrega variáveis de ambiente
load_dotenv()

# Configurações (agora via variáveis de ambiente)
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'database': os.getenv('DB_NAME', 'opticarQuente'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', 'matheus12'),
    'port': os.getenv('DB_PORT', '3306')
}

# DB_HOST_FRIO=localhost
# DB_NAME_FRIO=opticar
# DB_USER_FRIO=root
# DB_PASSWORD_FRIO=opticar123
# DB_PORT_FRIO=3308

DB_CONFIG_FRIO = {
    'host': os.getenv('DB_HOST_FRIO', 'localhost'),
    'database': os.getenv('DB_NAME_FRIO', 'opticarFrio'),
    'user': os.getenv('DB_USER_FRIO', 'root'),
    'password': os.getenv('DB_PASSWORD_FRIO', 'matheus12'),
    'port': os.getenv('DB_PORT_FRIO', '3306')
}

JIRA_CONFIG = {
    'server': os.getenv('JIRA_SERVER'),
    'email': os.getenv('JIRA_EMAIL'),
    'api_token': os.getenv('JIRA_API_TOKEN'),
    'project_key': os.getenv('JIRA_PROJECT_KEY', 'MOT')
}

# Conecta ao JIRA
jira = JIRA(
    server=JIRA_CONFIG['server'],
    basic_auth=(JIRA_CONFIG['email'], JIRA_CONFIG['api_token'])
)


# --- CÓDIGO DE VERIFICAÇÃO ---
print("\n🔍 Validando configuração do JIRA:")
print(f"Servidor: {JIRA_CONFIG['server']}")
print(f"Usuário: {JIRA_CONFIG['email']}")
print(f"Project Key configurado: {JIRA_CONFIG['project_key']}")

################################################################
fields = jira.fields()
print("\n🔧 Campos personalizados disponíveis:")
for field in fields:
    if field['custom']:
        print(f"- {field['id']}: {field['name']}")
################################################################
# Lista todos os projetos disponíveis
projects = jira.projects()
print("\n📋 Projetos disponíveis neste JIRA:")
for project in projects:
    print(f"→ {project.key}: {project.name}")

# Verifica se o projeto existe
try:
    project = jira.project(JIRA_CONFIG['project_key'])
    print(f"\n✅ Projeto válido: {project.key} - {project.name}")
except Exception as e:
    print(f"\n❌ Erro: O projeto '{JIRA_CONFIG['project_key']}' não existe ou não está acessível")
    print(f"Detalhes: {str(e)}")
    exit(1)  # Encerra o script se o projeto for inválido
# ----------------------------------------------

issue_types = jira.issue_types_for_project('MOT')
print("\n🛠 Tipos de issues disponíveis no projeto MOT:")
for it in issue_types:
    print(f"- {it.name} (ID: {it.id})")

fields = jira.fields()
for field in fields:
    if 'urgency' in field['name'].lower():
        print(field['id'], field['name'])


def get_new_alerts(last_checked_id):
    """Busca novos alertas não processados no banco de dados"""
    conn = None
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)
        
        # Consulta reformulada com tratamento seguro de parâmetros
        query = """
            SELECT 
            a.idAlerta AS id,
            a.titulo AS title,
            a.prioridade AS prioridade,
            CONCAT(
                '**Valor do Alerta:** ', a.valor, '\n',
                '**Data/Hora:** ', DATE_FORMAT(a.dataHora, '%d/%m/%Y %H:%i:%s'), '\n',
                '**Descrição:** ', a.descricao, '\n',
                '**Componente:** ', IFNULL(a.componente, 'N/A'), '\n',
                '**Dados Técnicos:** [Captura #', a.fkCapturaDados, ']'
            ) AS description,
            CASE 
                WHEN a.prioridade = 'Crítica' THEN 'Highest'
                WHEN a.prioridade = 'Média' THEN 'Medium'
                ELSE 'Low'
            END AS priority,
            IFNULL(a.tipo_incidente, 'Incident') AS issue_type,
            a.componente AS component,
            sm.fkFabrica AS idFabrica  -- Adicionando idFabrica
        FROM 
            alerta a  -- Tabela alerta no banco opticarFrio
        JOIN 
            capturaDados cd ON cd.idCapturaDados = a.fkCapturaDados  -- Junção com capturaDados
        JOIN 
            componenteServidor cs ON cs.idComponenteServidor = cd.fkComponenteServidor  -- Junção com componenteServidor
        JOIN 
            servidor_maquina sm ON sm.idMaquina = cs.fkMaquina  -- Junção com servidor_maquina (no banco opticar)
        WHERE 
            a.idAlerta > %(alert_id)s
            AND (a.jira_issue_key IS NULL OR a.jira_issue_key = '')
            AND (a.statusAlerta = 'ABERTO' OR a.statusAlerta = 'To Do')
        ORDER BY 
            a.idAlerta ASC;
        """
        
        # Parâmetros como dicionário
        params = {'alert_id': last_checked_id}
        
        print(f"Executando query com parâmetro: {params}")  # Debug
        cursor.execute(query, params)
        new_alerts = cursor.fetchall()
        print(f"Alertas encontrados: {len(new_alerts)}")  # Debug
        print(f"Alerta: {new_alerts}")

        time.sleep(2)
        
        return new_alerts
        
    except mysql.connector.Error as err:
        print(f"Erro MySQL: {err}")
        print(f"Query: {query}")  # Mostra a query
        print(f"Parâmetros: {params}")  # Mostra os parâmetros
        return []
    finally:
        if conn and conn.is_connected():
            conn.close()

ISSUE_TYPE_MAPPING = {
    'Incident': 'Submit a request or incident',
    'Question': 'Ask a question',
    'Request': 'Email request',
    'Alerta' : 'Alerta'
}

URGENCY = {
    'Highest' : 'Critical',
    'Medium' : 'Medium'
}


def get_factory(fabrica_id):
    """Busca informações da fábrica pelo ID"""
    try:
        conn_frio = mysql.connector.connect(**DB_CONFIG_FRIO)
        cursor_frio = conn_frio.cursor(dictionary=True)

        query = """
        SELECT idfabrica, nome FROM fabrica WHERE idfabrica = %(fabrica_id)s;
        """
        
        params = {'fabrica_id': fabrica_id}
        cursor_frio.execute(query, params)
        fabrica = cursor_frio.fetchone()  # Pega apenas um registro
        
        return fabrica or {'idfabrica': fabrica_id, 'nome': 'Fábrica Desconhecida'}
        
    except mysql.connector.Error as err:
        print(f"Erro ao buscar fábrica {fabrica_id}: {err}")
        return {'idfabrica': fabrica_id, 'nome': 'Fábrica Desconhecida'}
    finally:
        if 'conn_frio' in locals() and conn_frio.is_connected():
            conn_frio.close()


def create_jira_issue(alert):
    issue_type = ISSUE_TYPE_MAPPING.get(alert["issue_type"], 'Alerta')
    urgency = URGENCY.get(alert["priority"], 'Medium')  # Usa o priority já mapeado
    
    # Obter informações da fábrica
    fabrica = get_factory(alert["idFabrica"])
    idFabrica = int(fabrica['idfabrica'])
    print(f'Tipo fabrica: {type(idFabrica)}')
    
    issue_dict = {
        'project': {'key': 'MOT'},
        'summary': f'[Alerta {alert["id"]}] {alert["title"]} - Fábrica: {fabrica["nome"]}({fabrica['idfabrica']})',
        'description': alert["description"] + f"\n\n**Fábrica:** {fabrica['nome']} (ID: {fabrica['idfabrica']})",
        'issuetype': {'name': issue_type},  # Mude para um tipo da listagem
        'priority': {'name': alert["priority"]},
        'customfield_10057': idFabrica
    }
      # Adiciona campo personalizado para fábrica se ele existir no Jira
    # try:
    #     fields = jira.fields()
    #     for field in fields:
    #         if any(term in field['name'].lower() for term in ['fabrica', 'fábrica', 'local', 'site', 'location']):
    #             issue_dict[field['id']] = {'value': f"{fabrica['nome']} (ID: {fabrica['idfabrica']})"}
    #             break
    # except Exception as e:
    #     pass
        
    print(f"Urgency: {urgency}")
    print(f"Fábrica: {fabrica['nome']} (ID: {fabrica['idfabrica']})")
    print(issue_dict)
    
    try:
        new_issue = jira.create_issue(fields=issue_dict)
        print(f"✅ Chamado criado: {new_issue.key} para fábrica {fabrica['nome']}")
        return new_issue.key
    except Exception as e:
        print(f"❌ Erro completo: {str(e)}")
        return None
    

def update_alert_with_issue(alert_id, issue_key):
    """Atualiza o alerta com a chave do JIRA"""
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor()
    
    try:
        cursor.execute(
            "UPDATE alerta SET jira_issue_key = %s WHERE idAlerta = %s",
            (issue_key, alert_id))
        conn.commit()
    except Exception as e:
        print(f"⚠️ Erro ao atualizar alerta {alert_id}: {str(e)}")
    finally:
        conn.close()


def alertasBanco():
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        try:
            query ="SELECT * FROM alerta"
            cursor.execute(query)
            alertas = cursor.fetchall()
            print(f"Todos os alertas: {len(alertas)}")
            return alertas
        except Exception as e:
            print('Erro ao buscar os alertas')
        finally:
            conn.close()


def alertasJira():
    jql_query = 'project = MOT'
    # Explicitamente solicitar os campos necessários, incluindo status
    issues = jira.search_issues(jql_query, fields="key,summary,status,priority", maxResults=100)

    
    return issues
    # for issue in issues:
    #     print(f"ID: {issue.key}")
    #     print(f"Resumo: {issue.fields.summary}")
    #     print(f"Status: {issue.fields.status.name}")
    #     print(f"Prioridade: {issue.fields.priority.name}")
    #     print("-" * 50)


def atualizar_alertas():
    dadosBanco = alertasBanco()
    dadosJira = alertasJira()
    for alerta in dadosJira:
        jira_status = alerta.fields.status.name
        print("ESTOU NO ATUALIZAR ALERTASSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS")
        print(jira_status)
        print(f"Ticket {alerta.key} - Status no JIRA: '{jira_status}'")
        for alertaBanco in dadosBanco:
            # print('teste', alertaBanco[10] )
            if alerta.key == alertaBanco[15]:
                print(f'O {alerta.key} do JIRA é igual a {alertaBanco[15]} do banco')
                if alerta.fields.status.name != alertaBanco[9]:
                    conn = mysql.connector.connect(**DB_CONFIG)
                    cursor = conn.cursor()
                    try:
                        cursor.execute("UPDATE alerta SET statusAlerta = %s WHERE jira_issue_key = %s", (alerta.fields.status.name, alerta.key))
                        conn.commit()
                        print(f'Alerta {alerta.fields.status.name} atualizado no banco')
                    except Exception as e:
                        print('Erro no update do alerta')
                    finally:
                        conn.close()


def main():
    last_checked_id = 0  # Persistir este valor em produção
    
    while True:
        print("🔄 Verificando novos alertas...")
        try:
            new_alerts = get_new_alerts(last_checked_id)
            
            if new_alerts:
                print(f"🔍 Encontrados {len(new_alerts)} novos alertas")
                for alert in new_alerts:
                    issue_key = create_jira_issue(alert)

                    if issue_key:
                        update_alert_with_issue(alert['id'], issue_key)
                        last_checked_id = alert['id']
            atualizar_alertas()
            time.sleep(2)  # Verifica a cada minuto
            
        except Exception as e:
            print(f"⚠️ Erro no loop principal: {str(e)}")
            time.sleep(2)  # Espera 5 minutos em caso de erro


if __name__ == "__main__":
    main()

# Código de teste - remover em produção
projects = jira.projects()
print("Projetos disponíveis:", [p.key for p in projects])