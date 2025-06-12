#!/bin/bash

ARQUIVO=".env.dev"

# Verifica se o arquivo existe
if [ ! -f "$ARQUIVO" ]; then
  echo "Arquivo $ARQUIVO não encontrado!"
  exit 1
fi

# Solicita os novos valores ao usuário
read -p "Digite o novo aws_access_key_id: " NOVO_ID
read -p "Digite o novo aws_secret_access_key: " NOVO_SECRET
read -p "Digite o novo aws_session_token: " NOVO_TOKEN

# Função que substitui ou adiciona a variável no arquivo
atualiza_ou_adiciona() {
  VARIAVEL="$1"
  NOVO_VALOR="$2"
  if grep -q "^$VARIAVEL=" "$ARQUIVO"; then
    sed -i "s|^$VARIAVEL=.*|$VARIAVEL=$NOVO_VALOR|" "$ARQUIVO"
  else
    echo "$VARIAVEL=$NOVO_VALOR" >> "$ARQUIVO"
  fi
}

# Atualiza ou adiciona cada uma das variáveis
atualiza_ou_adiciona "aws_access_key_id" "$NOVO_ID"
atualiza_ou_adiciona "aws_secret_access_key" "$NOVO_SECRET"
atualiza_ou_adiciona "aws_session_token" "$NOVO_TOKEN"

echo "✅ Variáveis AWS atualizadas com sucesso no arquivo $ARQUIVO!"
