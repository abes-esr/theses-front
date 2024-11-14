<template>
  <!--  Mobile-->
  <CommonHeaderMobile v-if="mobile" type="home" @displayError="displayError" @activate-menu="activateMenu"
                      :loading="loading" :show-menu="showMenu">
  </CommonHeaderMobile>
  <!--  Fin Mobile-->
  <article>
        <a href="https://theses.fr/">Back to home page</a>
        <h1>About</h1>
        <span>
            <p>As a search engine for French doctoral theses, the <a href="https://theses.fr/"
                    target="_blank">theses.fr</a> website aims to reference:</p>
            <ul>
                <li>doctoral theses being prepared in France, if the registration institution has chosen to
                    list them and if the doctoral student has not objected to the listing.</li>
                <li>doctoral theses defended in France since 1985, regardless of the format of the thesis
                    (printed or digital).</li>
                <li>people and organisations involved in these theses.</li>
            </ul>
            <h2>A database supplied by the institutions where the thesis was submitted</h2>
            <p><a href="https://theses.fr/" target="_blank">theses.fr</a>  is the showcase for data produced and validated by the various staff at French
              higher education establishments authorised to award doctorates (tuition services, doctoral
              schools, libraries and documentation centres, research support services, etc.)</p>
            <p>The data displayed on theses.fr comes from the following source applications:</p>
            <ul>
                <li><strong>STEP (Signalement des Th&egrave;ses en Pr&eacute;paration)</strong> reporting tool for ongoing theses</li>
                <li><strong>STAR (Signalement des Th&egrave;ses et Archivage)</strong> reporting tool for theses submitted in electronic format</li>
                <li><strong>the Sudoc collective catalogue</strong> for theses submitted in printed form, microfiches of
                  theses, reproductions of theses in printed or electronic form, and theses published by
                  a publisher.</li>
            </ul>
            <p>The theses.fr database aims to reference all doctoral theses defended in France since 1985.
              Any shortcomings can be reported via <a href="https://stp.abes.fr/node/3?origine=thesesFr" target="_blank"
                    :title="$t('abesSTP')">ABESstp, the Abes online helpdesk
                <v-icon :title="$t('externalLink')" size="x-small">mdi-open-in-new</v-icon>
              </a>.
            </p>
            <p>However, theses.fr does not reference:</p>
            <ul>
                <li>Research Supervision Certification (HDR)</li>
                <li>theses leading to the award of a State diploma for practising as a doctor (in medicine,
                  pharmacy, dental surgery or veterinary surgery)</li>
                <li>foreign doctoral theses (including those written in French)</li>
                <li>French doctoral theses defended before 1985</li>
            </ul>
            <h2>An interface and APIs</h2>
            <p>The data on <a href="https://theses.fr/" target="_blank">theses.fr</a> can be accessed via the
                <a href="https://theses.fr/" target="_blank">www.theses.fr</a> website using a search engine
                  and faceted navigation. A <a href="https://documentation.abes.fr/aidetheses/thesesfr/index.html"
                    target="_blank" :title="$t('thesisDocumentation')"> guide to using the search engine<v-icon :title="$t('externalLink')" size="x-small">mdi-open-in-new</v-icon></a>
              is available to users. In line with the Abes policy of opening up data, <a href="https://theses.fr/"
                    target="_blank">theses.fr</a> is part of the web of data and linked data movement.
            </p>
            <p>Raw data is in the public domain and has been placed <a
                    href="https://abes.fr/reseau-theses/reutiliser-les-donnees/" target="_blank"
                    :title="$t('etaLab')">under an Etalab licence <v-icon :title="$t('externalLink')" size="x-small">mdi-open-in-new</v-icon></a>.
                They are available via an
                <a href="https://documentation.abes.fr/aidetheses/thesesfr/co/RecupererDonneesAPI.html" target="_blank"
                    :title="$t('thesisAPIDocumentation')">XML API <v-icon :title="$t('externalLink')" size="x-small">mdi-open-in-new</v-icon></a>.
            </p>
            <p>To encourage their re-use, data relating to defended theses is also available in the form of a <em>dump</em> filed and updated annually on the data.gouv.fr website:
              <a href="https://www.data.gouv.fr/fr/datasets/theses-soutenues-en-france-depuis-1985/" target="_blank"
                    :title="$t('dataGouv') + $t('externalLink')"> Theses defended in France since 1985<v-icon :title="$t('externalLink')"
                        size="x-small">mdi-open-in-new</v-icon></a>. A re-use guide is provided alongside the data extraction.</p>

            <h2>History of the "Theses Portal" project</h2>
            <h3>Theses.fr v1</h3>
            <h4>Initial objectives of the project</h4>
            <p><a href="https://theses.fr/" target="_blank">theses.fr</a> is one of the applications of the "Portail des thèses" project, entrusted to Abes in
              2009 by the French Ministry of Higher Education and Research. The decision-making and
              operations committee for the "Portail des Thèses" project approved the main focuses of a
              roadmap that incorporated three key areas for action:</p>
            <ul>
                <li><strong>Increasing the national and international visibility of French doctoral research:</strong>&nbsp;<a href="https://theses.fr/" target="_blank">theses.fr</a> makes the data describing doctoral theses widely available on the web
                </li>
                <li><strong>Serving the academic world:</strong> <a href="https://theses.fr/"
                        target="_blank">theses.fr</a> provides the scientific community with as
                    accurate a picture as possible of the state of doctoral research in progress, at
                    national and local level, by discipline or by research theme</li>
                <li><strong>Serving the business world:</strong>&nbsp;by promoting the work of doctoral students and PhDs,
                  <a href="https://theses.fr/" target="_blank">theses.fr</a>
                     aims to facilitate the professional integration of young researchers</li>
            </ul>
            <br />
            <h4>Project governance and main partners</h4>
            <p>To successfully complete theses.fr, Abes has been supported by numerous partners.</p>
            <p>Composition of the Decision and Operations Committee (DOC) for the project:</p>
            <ul>
                <li>three representatives of the French Ministry of Higher Education and Research:
                  Mission de l'information scientifique et technique et du réseau documentaire
                  (MISTRD), Direction générale pour l'enseignement supérieur et l'insertion
                  professionnelle (DGESIP), Direction générale pour la recherche et l'innovation
                  (DGRI)
                </li>
                <li>a representative of the 
                  <a href="https://franceuniversites.fr/ " target="_blank" :title="$t('franceUniversite')">
                    Conference of University Chairs
                    <v-icon :title="$t('externalLink')" size="x-small">mdi-open-in-new</v-icon>
                  </a>
                </li>
                <li>a representative of the
                  <a href="http://www.cge.asso.fr/" target="_blank"
                        :title="$t('grandesEcoles')">Conference of Grandes Ecoles <v-icon :title="$t('externalLink')" size="x-small">mdi-open-in-new</v-icon>
                  </a>
                </li>
                <li>
                  a representative of doctoral programmes in accredited institutions
                </li>
                <li>
                  two representatives of private research or the business world
                </li>
                <li>
                  three representatives of the national documentation operators for theses in France:
                  <a href="http://www.inist.fr/" :title="$t('iist')">
                    CNRS-INIST
                    <v-icon :title="$t('externalLink')" size="x-small">mdi-open-in-new</v-icon></a>
                  ,<a href="http://www.diffusiontheses.fr/content/4-anrt-lille-reproduction-theses" target="_blank"
                        :title="$t('reproductionTheses')">
                      Atelier national de reproduction des thèses de Lille
                    <v-icon :title="$t('externalLink')"
                            size="x-small">mdi-open-in-new</v-icon></a>
                  , <a href="http://www.cines.fr/" target="_blank"
                        :title="$t('cines')">CINES
                        <v-icon :title="$t('externalLink')" size="x-small">mdi-open-in-new</v-icon></a>
                </li>
                <li>
                  three representatives of associations:
                  <a href="https://www.abg.asso.fr" target="_blank"
                        :title="$t('bernardGregory')">Intelli&rsquo;Agence
                        <v-icon :title="$t('externalLink')" size="x-small">mdi-open-in-new</v-icon>
                  </a> (Association Bernard Gregory)
                  , <a href="http://www.adbu.fr" target="_blank"
                        :title="$t('bud')">
                        ADBU <v-icon :title="$t('externalLink')" size="x-small">mdi-open-in-new</v-icon>
                    </a> (association of the network of users of Abes products), the AURA (association of the network of users of Abes products)
                </li>
            </ul>
            <p>The minutes of the DOC's decisions have been posted on the
              <a
                    href="https://fil.abes.fr/category/theses" target="_blank" :title="$t('filAbes')">
              Abes blog <v-icon :title="$t('externalLink')" size="x-small">mdi-open-in-new</v-icon>
              </a>.
            </p>
            <br />
            <h4>Progressive data transfer</h4>
            <p>Data relating to French doctoral theses is gradually being added to theses.fr:</p>
            <ul>
                <li><strong>July 2011&nbsp;:</strong>  launch of the theses.fr website, which initially only lists theses defended
                    since 2006 and submitted in electronic form.
                </li>
            </ul>
            <p>6,000 of them were listed in 2011.</p>
            <ul>
                <li><strong>September 2011:</strong> integration of the subjects of theses in progress. Data from the
                  Fichier Central des Thèses (FCT) was uploaded to theses.fr, incorporating more than
                  66,000 thesis subjects, mainly in the Humanities and Social Sciences. In the same
                  year, the FCT, maintained by the University of Paris Nanterre, was replaced by the
                  STEP application, which is maintained by Abes and open to all institutions, regardless
                  of discipline.
                </li>
            </ul>
            <p>As the use of STEP was optional, not all institutions listed the theses prepared under their
                supervision in STEP and theses.fr. However, the number of STEP members increased over
                the years.</p>
            <ul>
                <li><strong>May 2013:</strong> Sudoc data transferred to theses.fr. All theses defended in France and
                  archived in printed format since 1985 are intended to be referenced on these.
                </li>
            </ul>
            <p>In 2013, this represented almost 250,000 documents.</p>
            <ul>
                <li><strong>September 2016:</strong> electronic submission of theses became compulsory.
                </li>
            </ul>
            <p>The number of printed theses referenced on theses.fr stabilised at 300,000: it only increased
                marginally after this date.
            </p>
            <p>Since 2017, the number of electronic theses referenced has increased by around 14,000
                documents each year.</p>
            <p>Virtually all institutions that award doctorates now list the subjects of theses in progress
                under their supervision.</p>
            <p>&nbsp;</p>
            <h3>Theses.fr v2</h3>
            <p>From spring 2022, the Agence Bibliographique de l'Enseignement Supérieur launched a
                project to overhaul the theses.fr website.</p>
            <p>The objectives were:</p>
            <ul>
                <li>a complete overhaul of the technical base: the SolR tool has been replaced by Elastic Search</li>
                <li>the development of an ergonomic, responsive and accessible interface</li>
                <li>the introduction of controlled, centralised access to theses whose distribution is
                    restricted to the French higher education sector.</li>
            </ul>
            <br />
            <p>
                The site has largely been developed in-house, including the graphics. An external service
                provider has been hired for a year to support the technical team working on the people-
                related search engine.
            </p>
            <p>The new version of theses.fr has been released March 15, 2024.</p>
        </span>
    </article>
</template>

<script setup>
import { useDisplay } from "vuetify";
import { ref } from "vue";

const { mobile } = useDisplay();
const showMenu = ref(false);

useSeoMeta({
  title: `A Propos | Theses.fr`,
  ogTitle: `A Propos | Theses.fr`,
  description: "Page A Propos de Theses.fr",
  ogDescription: "Page A Propos de Theses.fr"
});

/**
 * Fonctionnement du header mobile
 */
function activateMenu() {
  sleep(250).then(() => {
    showMenu.value = !showMenu.value;
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
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
    font-size: 30px;
    padding-top: 20px;
    padding-bottom: 10px;
}

h3 {
    font-size: 25px;
    padding-bottom: 7px;
}

h4 {
    font-size: 20px;
}

#logoIMG {
    margin-top: 10px;

    @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
        margin-top: 20px;
    }
}
</style>