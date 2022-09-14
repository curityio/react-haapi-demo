const staticResourceRootPath = ""
const assetPath = staticResourceRootPath || "/"

const theme = {
  themeName: "curity-theme",
  poweredBy: true,
  paths: {
    mainCSSPath: `${assetPath}css/main.css`,
    themeCSSPath: `${assetPath}css/curity-theme.css`,
  },
  skin: {
    loginFormBackground: "form-transparent" /* form-light, form-transparent */,
    bodyBackground: "body-dark" /* body-light, body-dark */,
  },
  authenticators: {
    singleColor: true,
    iconsOnly: true,
  },
  consentors: {
    singleColor: true,
    iconsOnly: true,
  },
  logo: {
    useLogo: true,
    logoPath: `${assetPath}images/curity-logo.svg`,
    logoWhitePath: `${assetPath}images/curity-logo-white.svg`,
  },
}

export { theme }
