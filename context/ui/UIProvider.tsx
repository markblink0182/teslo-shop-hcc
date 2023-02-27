import { UIContext, UIReducer } from './'
import { FC, PropsWithChildren, useReducer } from 'react'

export interface UIState{
    isMenuOpen: boolean
}

const UI_INITIAL_STATE: UIState = {
    isMenuOpen:false
}

export const UIProvider:FC<PropsWithChildren> = ({children }) => {
     const [state, dispatch] = useReducer(UIReducer, UI_INITIAL_STATE);

     const toogleSideMenu = ()=>{
        dispatch({ type: '[UI] - ToogleMenu' })
    }

     return (
       <UIContext.Provider value={{
         ...state,
         toogleSideMenu
       }}>
      { children }
      </UIContext.Provider>
      )
}
