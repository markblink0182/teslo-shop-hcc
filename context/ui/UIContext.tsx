import { createContext } from 'react';

interface contextProps {
     isMenuOpen: boolean,
     toogleSideMenu: () => void
}

export const UIContext = createContext({} as contextProps);