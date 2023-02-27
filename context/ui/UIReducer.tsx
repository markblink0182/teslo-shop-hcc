import { UIState } from './'

type UIActionType = 
    | { type: '[UI] - ToogleMenu' } 

export const UIReducer = (state: UIState, action: UIActionType): UIState=>{

    switch (action.type) {
        case '[UI] - ToogleMenu':
           return {
              ...state,
              isMenuOpen : !state.isMenuOpen
            }

         default:
            return state;
    }
}