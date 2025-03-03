export default {
  logo: <span>Lexical Editor Easy</span>,
  project: {
    link: 'https://github.com/manish-jsx/lexical-editor'
  },
  docsRepositoryBase: 'https://github.com/manish-jsx/lexical-editor/tree/main/docs',
  footer: {
    text: `© ${new Date().getFullYear()} Lexical Editor Easy Documentation.`
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Lexical Editor Easy'
    }
  },
  primaryHue: 210,
  search: {
    placeholder: 'Search documentation...'
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true
  },
  feedback: {
    content: 'Question? Give us feedback →',
    labels: 'feedback'
  },
  editLink: {
    text: 'Edit this page on GitHub'
  },
  navigation: {
    prev: true,
    next: true
  }
}
