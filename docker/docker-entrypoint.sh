#!/bin/bash

# Paramètres par défaut du conteneur
export THESES_FRONT_VITE_APP_API=${THESES_FRONT_VITE_APP_API:='http://localhost:8081/'}


# Remplace les placeholders dans le code généré en prod
# THESES_FRONT_VITE_APP_API_PLACEHOLDER
# On va remplacer les placeholders depuis les JS originales
echo "-> Remplacement des placeholders venant du .env de vuejs dans la destination /usr/share/nginx/html/"
echo "-> THESES_FRONT_VITE_APP_API=${THESES_FRONT_VITE_APP_API}"
rm -rf /usr/share/nginx/html/
cp -rf /usr/share/nginx/html.orig/ /usr/share/nginx/html/
sed -i \
  "s#THESES_FRONT_VITE_APP_API_PLACEHOLDER#${THESES_FRONT_VITE_APP_API}#g" \
  /usr/share/nginx/html/assets/*
sed -i \
  "s#THESES_FRONT_VITE_APP_APIREF_PLACEHOLDER#${THESES_FRONT_VITE_APP_APIREF}#g" \
  /usr/share/nginx/html/assets/*