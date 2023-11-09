import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

const myCustomLightTheme = {
  dark: false,
  colors: {
    background: '#F9F9FB',
    surface: '#FFFFFF',
    primary: '#252C61',
    'primary-darken-1': '#3700B3',
    secondary: '#00A0DC',
    'secondary-darken-1': '#018786',
    'secondary-darken-2': '#005A8F',
    'orange-abes': '#CF491B',
    'gris-clair' : '#e6e6e6',
    'gris-fonce': '#b3b2b4',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
    'fond-noir': "#000000",
    'text-dark-blue': "#0B2134",
    'fond-chip-blue': "#ABB9D5",
    'text-footer': '#F9F9FB',
     'divider' : '#0b2134'
  }
}

const myCustomDarkTheme = {
  dark: true,
  colors: {
    background: '#1D2125',
    surface: '#161A1D',
    primary: '#6ca4d5',
    'primary-darken-1': '#91bbe0',
    secondary: '#00A0DC',
    'secondary-darken-1': '#018786',
    'secondary-darken-2': '#80adc7',
    'orange-abes': '#CF491B',
    'gris-clair' : '#5e5e5e',
    'gris-fonce': '#4c4d4b',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
    'fond-noir': "#000000",
    'text-dark-blue': "#c9c9c9",
    'fond-chip-blue': "#ABB9D5",
    'text-footer': '#FFFFFF',
    'divider' : '#e7e9eb'
  }
}

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
     theme: {
        defaultTheme: 'myCustomDarkTheme',
        themes: {
            myCustomLightTheme,
            myCustomDarkTheme
        }
    },
    ssr: true,
    display: {
        mobileBreakpoint: 'md'
    }
  })
  app.vueApp.use(vuetify)
})