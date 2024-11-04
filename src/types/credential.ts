import { VerifiableCredential as vCred } from '@digitalcredentials/vc-data-model'
import  { v4OpenAttestationDocument } from '@govtechsg/decentralized-renderer-react-components';
import { OpenAttestationDocument } from '@govtechsg/open-attestation'

export type IssuerURI = string;

export type IssuerImageURI = string;

export type IssuerImage = {
  readonly id: string
}

export type IssuerObject = {
  readonly id: IssuerURI;
  readonly type?: string;
  readonly name?: string;
  readonly url?: string;
  readonly image?: IssuerImageURI | IssuerImage;
  readonly certificateStore?: string;
}
export type Issuer = IssuerURI | IssuerObject;

export type CreditValue = {
  value?: string;
}

export type CompletionDocument = {
  readonly type?: string;
  readonly identifier?: string;
  readonly name?: string;
  readonly description?: string;
  readonly numberOfCredits?: CreditValue;
  readonly startDate?: string;
  readonly endDate?: string;
}

export type EducationalOperationalCredentialExtensions = {
  readonly type?: string[];
  readonly awardedOnCompletionOf?: CompletionDocument;
}

export type EducationalOperationalCredential = EducationalOperationalCredentialExtensions & {
  readonly id: string;
  readonly name?: string;
  readonly description?: string;
  readonly competencyRequired?: string;
  readonly credentialCategory?: string;
}

export type AlumniOf = {
  readonly name: string;
  readonly identifier: string;
}

export type Degree = {
  readonly name: string;
  readonly type: string;
}

export type OpenBadgeAchievement = {
  readonly achievementType?: string;
  readonly criteria?: {
        readonly narrative?: string
      };
  readonly description?: string;
  readonly id?: string;
  readonly name?: string;
  readonly type?: string;
  readonly image?: achievementImage;
}

type achievementImage = {
  readonly id?: string;
  readonly type?: string;
}

type SubjectExtensions = {
  readonly type?: string;
  readonly name?: string;
  readonly spouse?: string;
  readonly hasCredential?: EducationalOperationalCredential;
  readonly achievement?: OpenBadgeAchievement
  readonly alumniOf?: AlumniOf
  readonly degree?: Degree
  readonly assertion?: string;
}

export type Subject = SubjectExtensions & {
  readonly id?: string;
}

export type Proof = {
  type: string;
  created: string;
  verificationMethod: string;
  proofPurpose: string;
  proofValue?: string;
  challenge?: string;
  jws?: string;
  cryptosuite?: string;
}

export type CredentialStatus = {
  readonly id: string;
  readonly type: string | string[];
  readonly statusPurpose: string;
  readonly statusListIndex: string | number;
  readonly statusListCredential: string;
}

export type RenderMethod = {
  id: string;
  type: string;
  name?: string;
  css3MediaQuery?: string;
  digestMultibase?: string;
}

export type VerifiableCredentialV1 = {
  readonly '@context': string[];         
  readonly id?: string;                
  readonly type: string[];               
  readonly issuer: Issuer;               
  readonly issuanceDate: string;        
  readonly expirationDate?: string;      
  readonly credentialSubject: Subject;   
  readonly credentialStatus?: CredentialStatus | CredentialStatus[];
  readonly proof?: Proof;                
  readonly name?: string;
  readonly description?: string;
  renderMethod?: RenderMethod[];
  [x: string]: any;
}

export type VerifiableCredentialV2 = {
  readonly '@context': string[];         
  readonly id?: string;                 
  readonly type: string[];               
  readonly issuer: Issuer;              
  readonly validFrom?: string;          
  readonly validUntil?: string;         
  readonly credentialSubject: Subject;  
  readonly credentialStatus?: CredentialStatus | CredentialStatus[];
  readonly proof?: Proof;                
  readonly name?: string;
  readonly description?: string;
  renderMethod?: RenderMethod[]; 
  [x: string]: any;
}

export type VerifiableCredential = Exclude<vCred, string> & v4OpenAttestationDocument & OpenAttestationDocument | VerifiableCredentialV1 | VerifiableCredentialV2;

export enum CredentialErrorTypes {
  IsNotVerified = 'Credential is not verified.',
  CouldNotBeVerified = 'Credential could not be checked for verification and may be malformed.',
  DidNotInRegistry = 'Could not find issuer in registry with given DID.',
}



export type ErrorDetails = {
  cause: ErrorCause;
  code?: string;
  url?: string;
}

export type CredentialError = {
  details: ErrorDetails,
  message: string,
  name: string,
  stack?: string,
  isFatal?: boolean,
  log?: any
}

export type ErrorCause = {
  message: string;
  name: string;
  stack?: string
}

export type VerifyResultLog = {
  id: string,
  valid: boolean
}

export type VerifyResult = {
  verified: boolean;
  credential: VerifiableCredential;
  error: CredentialError;
  log: VerifyResultLog[];
}

export type VerifyResponse = {
  verified: boolean;
  results: VerifyResult[];
  registryName?: string;
}


export type SvgRenderingTemplate = {
  id: string,
  type?: string,
  name?: string,
  css3MediaQuery?: string,
  digestMultibase?: string,
}

export type OpenAttestationEmbeddedRenderer = {
  id: string,
  type?: string,
  rendererName?: string
}