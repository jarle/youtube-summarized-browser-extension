import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
    useSystemColorMode: true,
    initialColorMode: "system"
}

const ytSummarizedTheme = extendTheme({ config })

export { ytSummarizedTheme }
