<template>
    <div v-if="mobile" class="logo-menu-wrapper">
        <NuxtLink :to="{ path: '/', query: { domaine: 'theses' } }" title="Accueil du site" class="logo logo_home">
            <img alt="logo Theses" id="logoIMG" src="@/assets/icone-theses.svg" />
        </NuxtLink>
    </div>
    <NuxtLink v-else class="logo logo_home" :to="{ path: '/', query: { domaine: 'theses' } }">
        <img alt="Logo du site theses.fr" id="logoIMG" src="@/assets/icone-theses.svg" />
    </NuxtLink>
    <article>
        <a href="https://theses.fr/">Retour à l'accueil</a>
        <h1>A propos</h1>
        <span>
            <p>Moteur de recherche des th&egrave;ses de doctorat fran&ccedil;aises, le site <a href="https://theses.fr/"
                    target="_blank">theses.fr</a> a pour objet de r&eacute;f&eacute;rencer :</p>
            <ul>
                <li>les th&egrave;ses de doctorat en cours de pr&eacute;paration en France, si
                    l'&eacute;tablissement d'inscription a fait le choix de les signaler et si le ou la doctorant(e)
                    ne s'est pas oppos&eacute;(e) &agrave; ce signalement.</li>
                <li>les th&egrave;ses de doctorat soutenues en France depuis 1985, quel que soit le support
                    mat&eacute;riel de la th&egrave;se (imprim&eacute; ou num&eacute;rique).</li>
                <li>les personnes et les organismes en lien avec ces th&egrave;ses.</li>
            </ul>
            <h2>Une base de donn&eacute;es aliment&eacute;e par les &eacute;tablissements de soutenance</h2>
            <p><a href="https://theses.fr/" target="_blank">theses.fr</a> est la vitrine de donn&eacute;es produites et
                valid&eacute;es par les diff&eacute;rents personnels des &eacute;tablissements de
                l&rsquo;enseignement sup&eacute;rieur fran&ccedil;ais habilit&eacute;s &agrave; d&eacute;livrer le
                doctorat (services de scolarit&eacute;, &eacute;coles doctorales, biblioth&egrave;ques et centres de
                documentation, services d&rsquo;appui &agrave; la recherche&hellip;)</p>
            <p>Les donn&eacute;es affich&eacute;es sur theses.fr proviennent des applications sources
                suivantes&nbsp;:</p>
            <ul>
                <li><strong>STEP (Signalement des Th&egrave;ses en Pr&eacute;paration)</strong> pour les
                    th&egrave;ses en pr&eacute;paration</li>
                <li><strong>STAR (Signalement des Th&egrave;ses et Archivage)</strong> pour les th&egrave;ses
                    soutenues d&eacute;pos&eacute;es au format &eacute;lectronique</li>
                <li><strong>le catalogue collectif Sudoc</strong> pour les th&egrave;ses soutenues
                    d&eacute;pos&eacute;es au format imprim&eacute;, les microfiches de th&egrave;ses, les
                    reproductions de th&egrave;ses sur support imprim&eacute; ou &eacute;lectronique, ainsi que les
                    th&egrave;ses publi&eacute;es chez un &eacute;diteur.</li>
            </ul>
            <p>La base de donn&eacute;es theses.fr tend &agrave; r&eacute;f&eacute;rencer l&rsquo;ensemble des
                th&egrave;ses de doctorat soutenues en France depuis 1985. Les lacunes peuvent &ecirc;tre
                signal&eacute;es via <a href="https://stp.abes.fr/node/3?origine=thesesFr" target="_blank">ABESstp, le
                    guichet
                    d&rsquo;assistance en ligne de l&rsquo;Abes</a>.</p>
            <p>En revanche, theses.fr ne r&eacute;f&eacute;rence pas&nbsp;:</p>
            <ul>
                <li>les Habilitations &agrave; Diriger des Recherches (HDR)</li>
                <li>les th&egrave;ses d&rsquo;exercice donnant lieu &agrave; la d&eacute;livrance du dipl&ocirc;me
                    d&rsquo;Etat de docteur (en m&eacute;decine, pharmacie, chirurgie dentaire ou chirurgie
                    v&eacute;t&eacute;rinaire)&nbsp;</li>
                <li>les th&egrave;ses de doctorat &eacute;trang&egrave;res (y compris celles r&eacute;dig&eacute;es
                    en fran&ccedil;ais)&nbsp;</li>
                <li>les th&egrave;ses de doctorat fran&ccedil;aises soutenues avant 1985</li>
            </ul>
            <h2>Une interface et des API</h2>
            <p>Les donn&eacute;es de <a href="https://theses.fr/" target="_blank">theses.fr</a> sont accessibles via le site
                <a href="https://theses.fr/" target="_blank">www.theses.fr</a> gr&acirc;ce &agrave; un moteur de recherche
                et une
                navigation &agrave; facettes. Un <a href="https://documentation.abes.fr/aidetheses/thesesfr/index.html"
                    target="_blank">guide d&rsquo;utilisation du
                    moteur de recherche</a> est mis &agrave; la disposition des utilisateurs. Conform&eacute;ment
                &agrave; la politique d&rsquo;ouverture des donn&eacute;es de l&rsquo;Abes, <a href="https://theses.fr/"
                    target="_blank">theses.fr</a> s&rsquo;inscrit dans le mouvement du web de
                donn&eacute;es et du linked data.
            </p>
            <p>Les donn&eacute;es brutes rel&egrave;vent du domaine public et sont plac&eacute;es <a
                    href="https://abes.fr/reseau-theses/reutiliser-les-donnees/" target="_blank">sous licence Etalab</a>.
                Elles sont
                disponibles via une <a href="https://documentation.abes.fr/aidetheses/thesesfr/co/RecupererDonneesAPI.html"
                    target="_blank">API
                    XML</a>.</p>
            <p>Pour favoriser leur r&eacute;utilisation, les donn&eacute;es relatives aux th&egrave;ses soutenues
                sont &eacute;galement disponibles sous forme d&rsquo;un <em>dump</em> d&eacute;pos&eacute; et mis
                &agrave; jour annuellement sur le site data.gouv.fr&nbsp;: <a
                    href="https://www.data.gouv.fr/fr/datasets/theses-soutenues-en-france-depuis-1985/"
                    target="_blank">Th&egrave;ses
                    soutenues en France depuis 1985</a>. Un guide de r&eacute;utilisation accompagne
                l&rsquo;extraction.</p>
            <h2>Historique du projet &laquo;&nbsp;Portail des th&egrave;ses&nbsp;&raquo;</h2>
            <h3>Theses.fr v1</h3>
            <h4>Objectifs initiaux du projet</h4>
            <p><a href="https://theses.fr/" target="_blank">theses.fr</a> est une des applications du projet
                &laquo;&nbsp;Portail
                des th&egrave;ses&nbsp;&raquo;, confi&eacute; &agrave; l&rsquo;Abes en 2009 par le Minist&egrave;re
                de l&rsquo;enseignement sup&eacute;rieur et de la recherche. Le comit&eacute; de d&eacute;cision et
                d&rsquo;op&eacute;ration du projet &laquo;&nbsp;Portail des th&egrave;ses&nbsp;&raquo; a
                valid&eacute; les principales orientations d&rsquo;une feuille de route qui comportait trois axes
                principaux :</p>
            <ul>
                <li><strong>Renforcer la visibilit&eacute; nationale et internationale de la recherche doctorale
                        fran&ccedil;aise</strong>&nbsp;: <a href="https://theses.fr/" target="_blank">theses.fr</a> expose
                    largement
                    sur le web les donn&eacute;es d&eacute;crivant les th&egrave;ses de doctorat</li>
                <li><strong>Servir le monde acad&eacute;mique</strong>&nbsp;: <a href="https://theses.fr/"
                        target="_blank">theses.fr</a>
                    permet &agrave; la communaut&eacute; scientifique
                    d'avoir une connaissance aussi exacte que possible de l'&eacute;tat de la recherche doctorale en
                    cours, au niveau national, local, par disciplines ou par th&eacute;matiques de recherche</li>
                <li><strong>Servir le monde &eacute;conomique</strong>&nbsp;: en valorisant les travaux des
                    doctorants et des docteurs, <a href="https://theses.fr/" target="_blank">theses.fr</a> vise &agrave;
                    faciliter
                    l&rsquo;insertion professionnelle des jeunes chercheurs</li>
            </ul>
            <br />
            <h4>Gouvernance du projet et principaux partenaires</h4>
            <p>Pour mener &agrave; bien theses.fr, l&rsquo;Abes s&rsquo;est entour&eacute;e de nombreux partenaires.
            </p>
            <p>Composition du Comit&eacute; de d&eacute;cision et d&rsquo;op&eacute;ration (CDO) du projet :</p>
            <ul>
                <li>trois repr&eacute;sentants du Minist&egrave;re de l&rsquo;enseignement sup&eacute;rieur de la
                    recherche : Mission de l'information scientifique et technique et du r&eacute;seau documentaire
                    (MISTRD), Direction g&eacute;n&eacute;rale pour l'enseignement sup&eacute;rieur et l'insertion
                    professionnelle (DGESIP), Direction g&eacute;n&eacute;rale pour la recherche et l'innovation
                    (DGRI)</li>
                <li>un repr&eacute;sentant de la <a href="https://franceuniversites.fr/ " target="_blank">Conf&eacute;rence
                        des
                        Pr&eacute;sidents d&rsquo;Universit&eacute;</a></li>
                <li>un repr&eacute;sentant de la <a href="http://www.cge.asso.fr/" target="_blank">Conf&eacute;rence des
                        Grandes
                        Ecoles</a></li>
                <li>un repr&eacute;sentant des formations doctorales dans les &eacute;tablissements habilit&eacute;s
                </li>
                <li>deux repr&eacute;sentants de la recherche priv&eacute;e ou du monde &eacute;conomique</li>
                <li>trois repr&eacute;sentants des op&eacute;rateurs documentaires nationaux des th&egrave;ses en
                    France : <a href="http://www.inist.fr/">CNRS-INIST</a> ,<a
                        href="http://www.diffusiontheses.fr/content/4-anrt-lille-reproduction-theses"
                        target="_blank">Atelier
                        national de reproduction des th&egrave;ses de Lille</a>, <a href="http://www.cines.fr/"
                        target="_blank">CINES</a>
                </li>
                <li>trois repr&eacute;sentants d&rsquo;associations : <a href="https://www.abg.asso.fr"
                        target="_blank">l&rsquo;Intelli&rsquo;Agence </a>(Association Bernard
                    Gregory),<a href="http://www.adbu.fr" target="_blank"> l&rsquo;ADBU </a>(association des directeurs de
                    biblioth&egrave;ques universitaires), l&rsquo;AURA (association du r&eacute;seau des
                    utilisateurs des produits de l&rsquo;Abes)</li>
            </ul>
            <p>Les comptes-rendus de d&eacute;cisions du CDO ont fait l&rsquo;objet de billets sur le <a
                    href="https://fil.abes.fr/category/theses" target="_blank">blog de l&rsquo;Abes</a>.</p>
            <br />
            <h4>Versement progressif des donn&eacute;es</h4>
            <p>Le versement dans theses.fr des donn&eacute;es relatives aux th&egrave;ses de doctorat
                fran&ccedil;aises s&rsquo;est fait progressivement&nbsp;:</p>
            <ul>
                <li><strong>Juillet 2011&nbsp;:</strong> ouverture du site theses.fr qui, dans un premier temps,
                    r&eacute;f&eacute;rence uniquement les th&egrave;ses soutenues depuis 2006 et
                    d&eacute;pos&eacute;es au format &eacute;lectronique.</li>
            </ul>
            <p>Elles sont 6 000 &agrave; &ecirc;tre r&eacute;f&eacute;renc&eacute;es en 2011.</p>
            <ul>
                <li><strong>Septembre 2011</strong>: int&eacute;gration des sujets de th&egrave;ses en
                    pr&eacute;paration. Les donn&eacute;es du Fichier Central des Th&egrave;ses (FCT) sont
                    vers&eacute;es dans theses.fr, soit plus de 66&nbsp;000 sujets de th&egrave;ses, principalement
                    en Lettres, Sciences Humaines et Sociales. La m&ecirc;me ann&eacute;e, le FCT, maintenu par
                    l&rsquo;Universit&eacute; Paris Nanterre, est remplac&eacute; par l&rsquo;application STEP,
                    maintenue par l&rsquo;Abes, ouverte &agrave; l&rsquo;ensemble des &eacute;tablissements, toutes
                    disciplines confondues.</li>
            </ul>
            <p>L&rsquo;utilisation de STEP &eacute;tant facultative, tous les &eacute;tablissements ne
                r&eacute;f&eacute;rencent pas dans STEP et theses.fr les th&egrave;ses pr&eacute;par&eacute;es en
                leur sein. Le nombre d&rsquo;&eacute;tablissements adh&eacute;rents &agrave; STEP va
                n&eacute;anmoins augmenter au fil des ann&eacute;es.&nbsp;</p>
            <ul>
                <li><strong>Mai 2013&nbsp;:</strong> versement des donn&eacute;es du Sudoc dans theses.fr. Toutes
                    les th&egrave;ses soutenues en France et archiv&eacute;es au format imprim&eacute; depuis 1985
                    sont destin&eacute;es &agrave; &ecirc;tre r&eacute;f&eacute;renc&eacute;es dans theses.fr.</li>
            </ul>
            <p>En 2013, elles repr&eacute;sentent pr&egrave;s de 250&nbsp;000 documents.</p>
            <ul>
                <li><strong>Septembre 2016&nbsp;:</strong> le d&eacute;p&ocirc;t &eacute;lectronique des
                    th&egrave;ses est rendu obligatoire.</li>
            </ul>
            <p>Le nombre de th&egrave;ses imprim&eacute;es r&eacute;f&eacute;renc&eacute;es dans theses.fr se
                stabilise &agrave; 300&nbsp;000&nbsp;: il n&rsquo;augmentera plus que de mani&egrave;re marginale.
            </p>
            <p>Depuis 2017, le nombre de th&egrave;ses &eacute;lectroniques r&eacute;f&eacute;renc&eacute;es
                augmente d&rsquo;environ 14&nbsp;000 documents chaque ann&eacute;e.</p>
            <p>D&eacute;sormais, la quasi-totalit&eacute; des &eacute;tablissements qui d&eacute;livrent le doctorat
                signalent les sujets de th&egrave;ses pr&eacute;par&eacute;s en leur sein.</p>
            <p>&nbsp;</p>
            <h3>Theses.fr v2</h3>
            <p>A partir du printemps 2022, l’Agence Bibliographique de l’Enseignement Supérieur lance le projet de refonte
                du site theses.fr.</p>
            <p>Les objectifs sont : </p>
            <ul>
                <li>la refonte complète du socle technique : l’outil SolR est remplacé par Elastic Search</li>
                <li>le développement d’une interface ergonomique, responsive et accessible</li>
                <li>la mise en place d’un accès contrôlé, centralisé, aux thèses dont la diffusion est restreinte au
                    périmètre de l’enseignement supérieur français</li>
            </ul>
            <br />
            <p>
                Le site est développé en grande partie en interne, y compris la partie graphique. Un prestataire externe est
                engagé pendant un an pour appuyer l’équipe technique sur le moteur de recherche consacré aux personnes.
            </p>
            <p>La nouvelle version de theses.fr est déployée en production en 2024.</p>
        </span>
    </article>
</template>

<script setup>
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();

useSeoMeta({
    title: `A Propos | Theses.fr`,
    ogTitle: `A Propos | Theses.fr`,
    description: "Page A Propos de Theses.fr",
    ogDescription: "Page A Propos de Theses.fr"
})
</script>

<style scoped lang="scss">
@use 'vuetify/settings';

article {
    padding: 0 40px 10px 40px;
}

li {
    margin-left: 40px;
}

p {
    padding-bottom: 10px;
}

h1 {
    padding-bottom: 20px;
    font-size: 48px;
}

h2 {
    padding-top: 20px;
    padding-bottom: 10px;
}

h3 {
    font-size: 20px;
    padding-bottom: 7px;
}

#logoIMG {
    margin-top: 10px;

    @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
        margin-top: 20px;
    }
}
</style>