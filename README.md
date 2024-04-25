# theses-front
[![build-test-pubtodockerhub](https://github.com/abes-esr/theses-front/actions/workflows/build-test-pubtodockerhub.yml/badge.svg)](https://github.com/abes-esr/theses-front/actions/workflows/build-test-pubtodockerhub.yml) [![Docker Pulls](https://img.shields.io/docker/pulls/abesesr/theses.svg)](https://hub.docker.com/r/abesesr/theses/)

Le moteur de recherche theses.fr recense l’ensemble des thèses de doctorat soutenues en France depuis 1985, les sujets de thèse préparés au sein des établissements de l’enseignement supérieur français, et les personnes impliquées dans la recherche doctorale française. 

Ce dépôt héberge le code source de l'interface utilisateur du site theses.fr.

URL publique : https://theses.fr

![logo theses.fr](https://theses.fr/icone-theses-beta.svg)

L'application complète peut être déployée via Docker à l'aide du dépôt https://github.com/abes-esr/theses-docker

## Architecture technique

L'interface est développée en Vue JS 3, à l'aide du framework NuxtJS 3, qui permet de tirer profit du Server Side Rendering pour certaines pages. Le projet utilise également la bibliothèque de composants Vuetify.
Le projet est ensuite déployé dans un container docker, dans le SI de l'Abes (le docker compose est disponible [ici](https://github.com/abes-esr/theses-docker) )

Les données affichées par cet interface sont obtenues en interrogeant les API theses.fr : 
* https://github.com/abes-esr/theses-api-recherche pour la recherche et l'affichage de theses
* https://github.com/abes-esr/theses-api-export pour les exports des theses en différents formats (CSV, XML, BIBTEX, etc)
* https://github.com/abes-esr/theses-api-diffusion pour la mise à disposition des documents (PDFs et autres)

## Utilisation du projet

### Installation des dépendances 

```bash
# npm
npm install
```

### Démarrage du serveur local

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev
```

### Production

Build et packaging de l'application pour la production :

```bash
# npm
npm run build
```

Plus d'infos sur le déploiement dans la documentation de Nuxt 3 [deployment documentation](https://nuxt.com/docs/getting-started/deployment) .


### Mode maintenance

L'application est dotée d'un mode maintenance, qui a pour effet de rediriger tous les visiteurs vers la page /maintenance à l'aide d'un middleware Nuxt (le template de la page de maintenance est dans /pages/maintenance.vue)

Le message affiché sur la page de maintenance est modifiable dans le .env ```THESES_FRONT_VITE_APP_MAINTENANCE_MESSAGE```. Un redémarrage du container est nécessaire lors de la mise à jour du message de maintenance.


Pour passer l'application en mode maintenance, il suffit de passer la valeur de ```THESES_FRONT_VITE_APP_IS_MAINTENANCE``` dans le .env à ```true```, puis de relancer le container : ```sudo docker compose up -d```

Une fois la maintenance terminée, effectuer la manipulation inverse, remettre ```THESES_FRONT_VITE_APP_IS_MAINTENANCE``` dans le .env à ```false```, puis de relancer le container : ```sudo docker compose up -d```



> [!NOTE]  
> Aucune page n'est accessible lorsque le mode maintenance est activé (sauf la page de maintenance). Toutes les autres routes sont redirigées vers cette page.
> 
> Egalement, lorsque le mode maintenance est désactivée, il n'est pas possible d'aller sur /maintenance, cela vous redirigera vers la page d'accueil.
