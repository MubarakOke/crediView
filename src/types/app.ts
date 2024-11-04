import {VerifiableCredentialV1, VerifiableCredentialV2, VerifiableCredential} from '@/types/credential'

export type CredentialData = {
  [key: string]: any
}

export type Notification = {
    message: string;
    status: boolean;
}
  
export type propsData = {
    credential: VerifiableCredential | null,
    setCredential: React.Dispatch<React.SetStateAction<VerifiableCredential|null>>,
    setOpenViewer: React.Dispatch<React.SetStateAction<boolean>>
}