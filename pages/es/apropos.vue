<template>
  <!--  Mobile-->
  <ClientOnly>
    <CommonHeaderMobile v-if="mobile" type="home" @displayError="displayError" @activate-menu="activateMenu"
                        :loading="loading" :show-menu="showMenu">
    </CommonHeaderMobile>
  </ClientOnly>
  <!--  Fin Mobile-->
  <NuxtLink v-if="!mobile" class="logo logo_home" :to="{ name: 'index', query: { domaine: 'theses' } }">
    <img :alt="$t('homepage')" id="logoIMG" src="/icone-theses-beta.svg" />
  </NuxtLink>
  <article>
    <a href="https://theses.fr/">Volver a la página de inicio</a>
    <h1>Acerca de</h1>
    <span>
            <p>Motor de búsqueda de las tesis doctorales francesas, el sitio web <a href="https://theses.fr/"
                                                                     target="_blank">theses.fr</a> tiene como objeto catalogar:</p>
            <ul>
                <li>las tesis doctorales en curso de elaboración en Francia, si la institución de registro ha
                    decidido notificarlas y si el/la doctorando/a no se ha opuesto a esta notificación.</li>
                <li>las tesis doctorales defendidas en Francia desde 1985, independientemente de cuál
                    sea el material de soporte de la tesis (impreso o digital).</li>
                <li>las personas y los organismos en relación con estas tesis.</li>
            </ul>
            <h2>Una base de datos alimentada por las instituciones de defensa de las tesis</h2>
            <p><a href="https://theses.fr/" target="_blank">theses.fr</a>  es el escaparate de datos elaborados y validados por los distintos actores de las
              instituciones de enseñanza superior francesas autorizadas para conceder doctorados
              (servicios de gestión académica, escuelas doctorales, bibliotecas y centros de
              documentación, servicios de apoyo a la investigación...)</p>
            <p>Los datos que contiene theses.fr proceden de las siguientes aplicaciones fuente:</p>
            <ul>
                <li><strong>STEP (Signalement des Th&egrave;ses en Pr&eacute;paration)</strong>, que informa sobre las tesis en curso de preparación</li>
                <li><strong>STAR (Signalement des Th&egrave;ses et Archivage)</strong>, información y archivo para las tesis defendidas presentadas en formato electrónico</li>
                <li><strong>the Sudoc collective catalogue</strong> para las tesis defendidas presentadas en formato
                  impreso, las microfichas de tesis, las reproducciones de tesis en formato impreso o
                  electrónico y las tesis publicadas por un editor.</li>
            </ul>
            <p>La base de datos theses.fr pretende catalogar todas las tesis doctorales defendidas en
              Francia desde 1985. Cualquier laguna puede comunicarse a través de <a href="https://stp.abes.fr/node/3?origine=thesesFr" target="_blank"
                                                      :title="$t('apropos.abesSTP')">ABESstp, el servicio de ayuda en línea de la Abes.
                <v-icon :title="$t('externalLink')" size="x-small">mdi-open-in-new</v-icon>
              </a>
            </p>
            <p>En cambio, theses.fr no registra:</p>
            <ul>
                <li>las Habilitaciones para Dirigir Investigaciones (HDR)</li>
                <li>las tesis de ejercicio que dan lugar a la concesión del diploma estatal de doctor (en
                  medicina, farmacia, cirugía dental o cirugía veterinaria)</li>
                <li>las tesis doctorales extranjeras (incluidas las redactadas en francés)</li>
                <li>las tesis doctorales francesas defendidas con anterioridad a 1985</li>
            </ul>
            <h2>Una interfaz y APIs</h2>
            <p>Se pueden consultar los datos de <a href="https://theses.fr/" target="_blank">theses.fr</a> en el sitio web
                <a href="https://theses.fr/" target="_blank">www.theses.fr</a>
                mediante un motor de búsqueda y una navigación por aspectos.
                Una <a href="https://documentation.abes.fr/aidetheses/thesesfr/index.html" target="_blank" :title="$t('apropos.thesisDocumentation')">
                 guía de utilización del motor de búsqueda
                <v-icon :title="$t('externalLink')" size="x-small">mdi-open-in-new</v-icon></a>
              está a disposición de los usuarios. De conformidad con la política de apertura de datos de la Abes,
              <a href="https://theses.fr/" target="_blank">theses.fr</a> forma parte del método de datos web y de datos vinculados.
            </p>
            <p>Los datos brutos son de dominio público y están sujetos
              <a href="https://abes.fr/reseau-theses/reutiliser-les-donnees/" target="_blank" :title="$t('apropos.etaLab')">
                a la licencia Etalab <v-icon :title="$t('externalLink')" size="x-small">mdi-open-in-new</v-icon>
              </a>
              . Están disponibles a través de una
              <a href="https://documentation.abes.fr/aidetheses/thesesfr/co/RecupererDonneesAPI.html" target="_blank" :title="$t('apropos.thesisAPIDocumentation')">
                API XML <v-icon :title="$t('externalLink')" size="x-small">mdi-open-in-new</v-icon>
              </a>.
            </p>
            <p>Para favorecer su reutilización, los datos relativos a las tesis defendidas también están
                disponibles en forma de un <em>dump</em> depositado y actualizado anualmente en el sitio web data.gouv.fr:
              <a href="https://www.data.gouv.fr/fr/datasets/theses-soutenues-en-france-depuis-1985/" target="_blank"
                 :title="$t('apropos.dataGouv') + $t('externalLink')">
                 Tesis defendidas en Francia desde 1985 <v-icon :title="$t('externalLink')" size="x-small">mdi-open-in-new</v-icon>
              </a>
              . La extracción va acompañada de una guía de reutilización.</p>

            <h2>Historia del proyecto «Portal de las tesis»</h2>
            <h3>Theses.fr v1</h3>
            <h4>Objetivos iniciales del proyecto</h4>
            <p><a href="https://theses.fr/" target="_blank">theses.fr</a>
               es una de las aplicaciones del proyecto «Portal de las tesis», confiado a la Abes en
              2009 por el Ministerio de Enseñanza Superior e Investigación. El comité de decisión y
              funcionamiento del proyecto «Portal de las tesis» validó las principales orientaciones de una
              hoja de ruta que incluía tres ejes principales:</p>
            <ul>
                <li><strong>Mejorar la visibilidad nacional e internacional de la investigación doctoral francesa:
                  </strong>&nbsp;<a href="https://theses.fr/" target="_blank">theses.fr</a>
                   presenta de forma extensa en la web los datos que describen las tesis doctorales
                </li>
                <li><strong>Servir al mundo académico:
                  </strong><a href="https://theses.fr/" target="_blank">theses.fr</a>
                   facilita a la comunidad científica tener un
                    conocimiento lo más preciso posible del estado de la investigación doctoral en curso,
                    a nivel nacional, local, por disciplinas o por temas de investigación
                </li>
                <li><strong>Servir al mundo empresarial:
                  </strong>&nbsp;valorando el trabajo de los doctorandos y doctores,
                  <a href="https://theses.fr/" target="_blank">theses.fr</a>
                     pretende facilitar la inserción profesional de los jóvenes investigadores
                </li>
            </ul>
            <br />
            <h4>Gobernanza del proyecto y principales socios</h4>
            <p>Para garantizar el éxito de theses.fr, la Abes se ha rodeado de muchos socios.</p>
            <p>Composición del Comité de Decisión y Operaciones (CDO) del proyecto:</p>
            <ul>
                <li>
                  tres representantes del Ministerio de Enseñanza Superior e Investigación: Misión de
                  la información científica y técnica y de la red documental (MISTRD), Dirección
                  general de la enseñanza superior y la inserción profesional (DGESIP) y la Dirección
                  general para la investigación y la innovación (DGRI)
                </li>
                <li>un representante de la
                  <a href="https://franceuniversites.fr/ " target="_blank" :title="$t('apropos.franceUniversite')">
                    Conferencia de Presidentes de Universidades
                    <v-icon :title="$t('externalLink')" size="x-small">mdi-open-in-new</v-icon>
                  </a>
                </li>
                <li>un representante de la
                  <a href="http://www.cge.asso.fr/" target="_blank"
                     :title="$t('apropos.grandesEcoles')">Conferencia de Grandes Escuelas <v-icon :title="$t('externalLink')" size="x-small">mdi-open-in-new</v-icon>
                  </a>
                </li>
                <li>
                  un representante de las formaciones de doctorado de las instituciones autorizadas
                </li>
                <li>
                  dos representantes de la investigación privada o del mundo empresarial
                </li>
                <li>
                  tres representantes de los operadores documentales nacionales de las tesis en Francia:
                  <a href="http://www.inist.fr/" :title="$t('apropos.iist')">
                    CNRS-INIST
                    <v-icon :title="$t('externalLink')" size="x-small">mdi-open-in-new</v-icon></a>
                  ,<a href="http://www.diffusiontheses.fr/content/4-anrt-lille-reproduction-theses" target="_blank"
                      :title="$t('apropos.reproductionTheses')">
                      Atelier national de reproduction des thèses de Lille
                    <v-icon :title="$t('externalLink')"
                            size="x-small">mdi-open-in-new</v-icon></a>
                  , <a href="http://www.cines.fr/" target="_blank"
                       :title="$t('apropos.cines')">CINES
                        <v-icon :title="$t('externalLink')" size="x-small">mdi-open-in-new</v-icon></a>
                </li>
                <li>
                  tres representantes de asociaciones:
                  <a href="https://www.abg.asso.fr" target="_blank"
                     :title="$t('apropos.bernardGregory')">l'Intelli&rsquo;Agence
                        <v-icon :title="$t('externalLink')" size="x-small">mdi-open-in-new</v-icon>
                  </a> (Association Bernard Gregory)
                  , <a href="http://www.adbu.fr" target="_blank"
                       :title="$t('apropos.bud')">
                        ADBU <v-icon :title="$t('externalLink')" size="x-small">mdi-open-in-new</v-icon>
                    </a> (asociaciòn de los directores de bibliotecas universitarias), la AURA (asociaciòn de la red de usuarios de los productos de la Abes)
                </li>
            </ul>
            <p>Las actas de las decisiones del CDO han sido objecto de entradas en el
              <a href="https://fil.abes.fr/category/theses" target="_blank" :title="$t('apropos.filAbes')">
              blog de la Abes <v-icon :title="$t('externalLink')" size="x-small">mdi-open-in-new</v-icon>
              </a>.
            </p>
            <br />
            <h4>Transferencia progresiva de los datos</h4>
            <p>La transferencia a theses.fr de los datos relativos a las tesis doctorales francesas se realizó gradualmente:</p>
            <ul>
                <li><strong>Julio de 2011&nbsp;:</strong>  apertura del sitio web theses.fr, que inicialmente sólo catalogó las
                  tesis defendidas desde 2006 y presentadas en formato electrónico.
                </li>
            </ul>
            <p>En 2011 se catalogaron 6.000 tesis.</p>
            <ul>
                <li><strong>Septiembre de 2011:</strong>  inclusión de las tesis en preparación. Los datos del Archivo
                  Central de Tesis (FCT) se añadieron a theses.fr, esto es, más de 66.000 temas de
                  tesis, principalmente en Letras, Humanidades y Ciencias Sociales. Ese mismo año,
                  el FCT, mantenido por la Universidad de París Nanterre, fue sustituido por la
                  aplicación STEP, mantenida por la Abes, abierta a todas las instituciones,
                  independientemente de cuál fuera su disciplina de conocimiento.
                </li>
            </ul>
            <p>Dado que el uso de STEP es opcional, no todas las instituciones registran en STEP y en
              theses.fr las tesis realizadas en su centro. No obstante, el número de instituciones que se
              han ido adhiriendo a STEP ha aumentado con los años.</p>
            <ul>
                <li><strong>Mayo de 2013:</strong> transferencia de los datos del Sudoc (Sistema Universitario de
                  Documentación) a theses.fr. Todas las tesis defendidas en Francia y archivadas en
                  formato impreso desde 1985 entraron a formar parte del catálogo de theses.fr.
                </li>
            </ul>
            <p>En 2013, estas representaban casi 250.000 documentos.</p>
            <ul>
                <li><strong>Septiembre de 2016:</strong>  se hizo obligatorio la presentación electrónica de las tesis.
                </li>
            </ul>
            <p>El número de tesis impresas catalogadas en theses.fr se estabilizó en 300.000: en el futuro
              sólo aumentaría en casos puntuales.</p>
            <p>Desde 2017, el número de tesis electrónicas catalogadas ha aumentado en unos 14.000
              documentos al año.</p>
            <p>En la actualidad, casi todas las instituciones que conceden doctorados comunican los temas
              de las tesis que se preparan en su centro.</p>
            <p>&nbsp;</p>

            <h3>Theses.fr v2</h3>
            <p>A partir de la primavera de 2022, la Agencia Bibliográfica de Enseñanza Superior (Abes)
              pone en marcha el proyecto de renovación del sitio web theses.fr.</p>
            <p>Los objetivos son:</p>
            <ul>
                <li>a modificación completa de la base técnica: la herramienta SolR es sustituida por Elastic Search</li>
                <li>el desarrollo de una interfaz ergonómica, reactiva y accesible</li>
                <li>el establecimiento de un acceso controlado y centralizado a las tesis cuya difusión está restringida al ámbito de la enseñanza superior francesa.</li>
            </ul>
            <br />
            <p>
              El sitio web se desarrolla en gran parte a nivel interno, incluida la parte gráfica. Se contrató a
              un proveedor de servicios externo durante un año para prestar apoyo al equipo técnico en
              relación al motor de búsqueda dedicado a los particulares.
            </p>
            <p>
              La nueva versión de theses.fr se ha desplegado en el entorno productivo en 2024.
            </p>
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