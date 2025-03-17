import {
    PiHouseLineDuotone,
    PiBookOpenUserDuotone,
    PiPlusCircleDuotone,
    PiGearDuotone,
    PiBuildingOfficeDuotone, PiUserDuotone, PiListDuotone
} from 'react-icons/pi'
import { ReactElement } from 'react'

export type NavigationIcons = Record<string, ReactElement>

const navigationIcon: NavigationIcons = {
    home: <PiHouseLineDuotone />,
    utilisateurMenuItem: <PiUserDuotone />,
    demandeMenu: <PiListDuotone />,
    createDemandeMenu: <PiPlusCircleDuotone />,
    documentMenu: <PiBookOpenUserDuotone />,
    organigrammeMenu: <PiBuildingOfficeDuotone />,
    parametreMenu: <PiGearDuotone />
}

export default navigationIcon
