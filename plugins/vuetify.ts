import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

const abesLightTheme = {
  dark: false,
  colors: {
    background: '#F9F9FB',
    surface: '#FFFFFF',
    primary: '#252C61',
    'primary-darken-1': '#3700B3',
    secondary: '#00A0DC',
    'secondary-darken-1': '#018786',
    'secondary-darken-2': '#005A8F',
    'secondary-darken-3': '#005A8F',
    'orange-abes': '#CF491B',
    'orange-abes-thesaurus': '#CF491B',
    'gris-clair' : '#e6e6e6',
    'gris-fonce': '#b3b2b4',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
    'fond-noir': "#000000",
    'text-dark-blue': "#0B2134",
    'fond-chip-blue': "#ABB9D5",
    'white-text': "#FFFFFF",
    'white-text-footer': "#FFFFFF",
    'gris-skeleton' : '#e6e6e6',
    'gris-switch': '#595759',
    'thesaurus-text': "#FFFFFF",
  }
}

const abesDarkTheme = {
  dark: false,
  colors: {
    background: '#343643',
    surface: '#343643',
    primary: '#FFFFFF',
    'primary-darken-1': '#FFFFFF',
    secondary: '#FFFFFF',
    'secondary-darken-1': '#FFFFFF',
    'secondary-darken-2': '#00AAEA',
    'secondary-darken-3': '#005A8F',
    'orange-abes': '#00AAEA',
    'orange-abes-thesaurus': '#FFFFFF',
    'gris-clair' : '#FFFFFF',
    'gris-fonce': '#FFFFFF',
    error: '#ff8080',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
    'fond-noir': "#000000",
    'text-dark-blue': "#FFFFFF",
    'fond-chip-blue': "#ABB9D5",
    'white-text': "#FFFFFF",
    'white-text-footer': "#FFFFFF",
    'thesaurus-text': "#005A8F",
    'gris-skeleton' : '#55586d',
    'gris-switch': '#b3b2b4'
  }
}

const abesInvertedTheme = {
  dark: false,
  colors: {
    background: '#000080',
    surface: '#000080',
    primary: '#ffff00',
    'primary-darken-1': '#ffff00',
    secondary: '#ffff00',
    'secondary-darken-1': '#ffff00',
    'secondary-darken-2': '#ffff00',
    'secondary-darken-3': '#ffff00',
    'orange-abes': '#ffff00',
    'orange-abes-thesaurus': '#ffff00',
    'gris-clair' : '#ffff00',
    'gris-fonce': '#ffff00',
    error: '#ffff00',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#ffff00',
    'fond-noir': "#000080",
    'text-dark-blue': "#ffff00",
    'fond-chip-blue': "#ffff00",
    'white-text': "#000080",
    'white-text-footer': "#ffff00",
    'thesaurus-text': "#000080",
    'gris-skeleton' : '#ffff00',
    'gris-switch': '#ffff00'
  }
}

export default defineNuxtPlugin((app) => {
  let ssr = true;

  if (!app.ssrContext?.event?.node?.req?.headers?.['user-agent']?.toLowerCase().includes('mobi')) {
    ssr = {
      clientWidth: 1281, // the desired width for initial render. This is a 'lg' breakpoint width
    };
  }

  const vuetify = createVuetify({
     theme: {
        defaultTheme: 'abesLightTheme',
        themes: {
            abesLightTheme,
            abesDarkTheme,
            abesInvertedTheme
        }
    },
    ssr: ssr,
    display: {
        mobileBreakpoint: 'md'
    },
    locale: {
      locale: 'fr'
    }
  })
  app.vueApp.use(vuetify)
})