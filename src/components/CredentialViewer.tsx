import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Store, ScrollText, Globe, TicketCheck, Tag, BookOpenCheck, ArrowLeft, ChevronLeft, ChevronRight, IdCard } from 'lucide-react'
import { propsData } from '@/types/app';
import { verifyCredential } from '@/lib/validate';
import { VerifiableCredential, RenderMethod } from '@/types/credential';
import { isActionOf } from "typesafe-actions";
import {FrameConnector, SvgRenderer, v4OpenAttestationDocument, SVG_RENDERER_TYPE, FrameActions, HostActionsHandler, updateHeight, updateTemplates, timeout } from '@govtechsg/decentralized-renderer-react-components';
import { OpenAttestationDocument } from '@govtechsg/open-attestation'
import {RENDER_METHOD_TYPE_ENUM, RENDER_METHOD_ABBR_ENUM, RENDER_METHOD_TYPE_ENUM_VALUE} from '../constants'

import {MetadataItem} from "@/components/shared/MetadataItem"
import {SubjectItem} from "@/components/shared/SubjectItem"
import {VerificationOverlay} from "@/components/shared/VerificationOverlay"
import {SectionLabel} from "@/components/shared/SectionLabel"
import {ViewTemplateButton} from "@/components/shared/ViewTemplateButton"


export default function Viewer({ credential, setOpenViewer, setCredential }: propsData) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  const [toFrame, setToFrame] = useState<HostActionsHandler>();
  const [height, setHeight] = useState(250);
  const [templates, setTemplates] = useState<{ id: string; label: string }[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [currentRenderMethodIndex, setCurrentRenderMethodIndex] = useState(0);
  const renderMethods = Array.isArray(credential?.renderMethod) ? credential.renderMethod : credential?.renderMethod? [credential.renderMethod] : [];
  const currentRenderMethod = renderMethods[currentRenderMethodIndex];
  const displayTypes = Array.isArray(credential?.type)? credential.type : credential?.type? [credential.type] : [];
  const displayIssuer= Array.isArray(credential?.issuer)? credential.issuer : credential?.issuer? [credential.issuer] : [];
  const displayCredentialSubject= Array.isArray(credential?.credentialSubject)? credential.credentialSubject : credential?.credentialSubject? [credential.credentialSubject] : [];
  
  const fn = useCallback((toFrame: HostActionsHandler) => {
    setToFrame(() => toFrame);
  }, []);
  
  useEffect(() => {
    if (toFrame && document) {
      toFrame({
        type: "RENDER_DOCUMENT",
        payload: {
          document: credential as OpenAttestationDocument,
        },
      });
    }
  }, [toFrame, credential]);

  useEffect(() => {
    if (toFrame && selectedTemplate) {
      toFrame({
        type: "SELECT_TEMPLATE",
        payload: selectedTemplate,
      });
    }
  }, [selectedTemplate, toFrame]);

  const fromFrame = (action: FrameActions): void => {
    if (isActionOf(updateHeight, action)) {
      setHeight(action.payload);
    }
    if (isActionOf(updateTemplates, action)) {
      setTemplates(action.payload);
      setSelectedTemplate(action.payload[0].id);
    }
    if (isActionOf(timeout, action)) {
      alert(`Connection timeout on renderer.\nPlease contact the administrator of ${currentRenderMethod?.id}.`);
    }
  };

  const handleGoBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setOpenViewer(false);
    setCredential(null);
    setIsVerifying(false);
    setVerificationResult(null);
  }

  const handleVerifyCredential = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsVerifying(true);
    // credential as VerifiableCredential;

    try {
      if (credential){
        let result= await verifyCredential(credential);
        console.log(JSON.stringify(result));
        
        setVerificationResult(result.verified)
      }
    } catch (error) {
      setVerificationResult(false);
    } finally {
      setIsVerifying(false);
    }
    

  }

  const renderCredential = (renderMethod: RenderMethod, credential: VerifiableCredential )=>{
    
    credential.renderMethod = renderMethods

    if(renderMethod){
      switch (renderMethod.type) {
        // case svg
        // case RENDER_METHOD_TYPE_ENUM.SvgRenderingTemplate:
        // case RENDER_METHOD_TYPE_ENUM.SvgRenderingTemplate2023:
        //   renderMethod.type = SVG_RENDERER_TYPE
        //   return <SvgRenderer document={credential as v4OpenAttestationDocument }/>
  
        //case iframe
        case RENDER_METHOD_TYPE_ENUM.OpenAttestationEmbeddedRenderer:
          return EmbeddedViewViewer(renderMethod);
  
        default:
          return ("")
    }
    }
    else{
      return ("")
    }
  }

  const EmbeddedViewViewer = (renderMethod: RenderMethod) => (
    <>
          <div className="flex justify-center space-x-2 bg-background p-2 rounded-t-md">
              {templates.map((template) => (
                <ViewTemplateButton key={template.id} selectedTemplateID={selectedTemplate} template={template} setSelectedTemplate={setSelectedTemplate} />
              ))}
          </div>
          <FrameConnector
                  source={renderMethod.id as string}
                  dispatch={fromFrame}
                  onConnected={fn}
                  onConnectionFailure={(setDocumentToRender) => setDocumentToRender(credential)}
                  style={
                          {   display: "block",
                              margin: "auto",
                              width: "100%",
                              height: `${height}px` }
                        } 
                  />
          </>
  )

  const RenderMethodSwitcherViewer = () => (
    (currentRenderMethod?
      ( <div className="flex justify-between items-center mb-4 p-0 rounded-lg shadow-md">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentRenderMethodIndex((prev) => (prev - 1 + renderMethods.length) % renderMethods.length)}
          disabled={renderMethods.length <= 1}
          className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="font-mono text-md font-bold text-gray-800 dark:text-gray-100">
          {RENDER_METHOD_ABBR_ENUM[currentRenderMethod.type as RENDER_METHOD_TYPE_ENUM_VALUE]? RENDER_METHOD_ABBR_ENUM[currentRenderMethod.type as RENDER_METHOD_TYPE_ENUM_VALUE]: "Image" } View
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentRenderMethodIndex((prev) => (prev + 1) % renderMethods.length)}
          disabled={renderMethods.length <= 1}
          className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>):
      ""
    )
  );

  const IssuerViewer = ()=> (
    displayIssuer.map((issuer, index)=>{  
      if(issuer instanceof Object && issuer.constructor === Object){
        return (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                  <div className='mb-5'>
                    {issuer.image && issuer.image.id? <img src={issuer.image.id} alt="Issuer image" className="w-13 h-13 mx-auto  rounded-md" /> : issuer.image? <img src={issuer.image} alt="Issuer image" className="w-13 h-13 mt-2 mx-auto  rounded-md" /> : ""}
                  </div>
                  {issuer.id? <MetadataItem icon={<IdCard className="w-4 h-4 text-green-500" />} label="ID" value={issuer.id} /> : "" }
                  {issuer.type? <MetadataItem icon={<ScrollText className="w-4 h-4 text-green-500" />} label="Type" value={issuer.type} />  : ""}
                  {issuer.name? <MetadataItem icon={<Store className="w-4 h-4 text-green-500" />} label="Name" value={issuer.name} /> : ""}
                  {issuer.url? <MetadataItem icon={<Globe className="w-4 h-4 text-green-500" />} label="URL" value={issuer.url} /> : ""}
                  {issuer.certificateStore? <MetadataItem icon={<TicketCheck className="w-4 h-4 text-green-500" />} label="Cert Store" value={issuer.certificateStore} /> : ""}
                </div>)
      } 
      else if (typeof issuer === 'string'){     
        return (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                  {issuer? <MetadataItem icon={<IdCard className="w-4 h-4 text-green-500" />} label="Issuer" value={issuer} /> : "" }
                </div>)
      }         
  })
  );

  const TypesViewer = ()=>(
    <div className="flex flex-wrap gap-2">
      {displayTypes.map((type, index) => (
        <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-100">
          <Tag className="w-3 h-3 mr-1" />
          {type}
        </Badge>
      ))}
    </div>
  )

  const CredentialSubjectViewer = ()=>(
    displayCredentialSubject.map((credentialSubject, index)=>{  
      if(credentialSubject instanceof Object && credentialSubject.constructor === Object){
        return (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                  {credentialSubject?.id? <SubjectItem label={"ID"} value={credentialSubject.id} /> : ""}
                  {credentialSubject?.type? <SubjectItem label={"Type"} value={credentialSubject.type} /> : ""}
                  {credentialSubject?.name? <SubjectItem label={"Name"} value={credentialSubject.name} /> : ""}
                  {credentialSubject?.spouse? <SubjectItem label={"Spouse"} value={credentialSubject.spouse} /> : ""}
                  {credentialSubject?.assertion? <SubjectItem label={"Spouse"} value={credentialSubject.assertion} /> : ""}
                  
                  {(credentialSubject.achievement && credentialSubject.achievement instanceof Object && credentialSubject.achievement.constructor === Object)?
                      <>
                        <div className='text-center font-mono font-bold'>Achievement</div>
                        {credentialSubject.achievement.type? <SubjectItem label={"Type"} value={credentialSubject.achievement.type} /> : ("")}
                        {credentialSubject.achievement.name? <SubjectItem label={"Name"} value={credentialSubject.achievement.name} /> : ""}
                        {credentialSubject.achievement.description? <SubjectItem label={"Description"} value={credentialSubject.achievement.description} /> : ""}
                        {(credentialSubject.achievement.criteria && credentialSubject.achievement.criteria instanceof Object && credentialSubject.achievement.criteria.constructor === Object)?
                            <>
                              {credentialSubject.achievement.criteria.type? <SubjectItem label={"Criteria"} value={credentialSubject.achievement.criteria.type} /> : ("")}
                              {credentialSubject.achievement.criteria.narrative? <SubjectItem label={"Narrative"} value={credentialSubject.achievement.criteria.narrative} /> : ("")}
                            </>
                            :
                            ("")
                        }
                      </>
                      : 
                      ("")}
                  {(credentialSubject.alumniOf && credentialSubject.alumniOf instanceof Object && credentialSubject.alumniOf.constructor === Object)?
                      <>
                        <div key={index} className='text-center font-mono font-bold'>Alumni</div>
                        {credentialSubject.alumniOf.name? <SubjectItem label={"Name"} value={credentialSubject.alumniOf.name} /> : ("")}
                        {credentialSubject.alumniOf.identifier? <SubjectItem label={"Identifier"} value={credentialSubject.alumniOf.identifier} /> : ""}
                      </>
                      : 
                      ("")}
                  {(credentialSubject.hasCredential && credentialSubject.hasCredential instanceof Object && credentialSubject.hasCredential.constructor === Object)?
                      <>
                        <div className='text-center font-mono font-bold'>Credential Required</div>
                        {credentialSubject.hasCredential.id? <SubjectItem label={"ID"} value={credentialSubject.hasCredential.id} /> : ("")}
                        {credentialSubject.hasCredential.name? <SubjectItem label={"Name"} value={credentialSubject.hasCredential.name} /> : ""}
                        {credentialSubject.hasCredential.description? <SubjectItem label={"Description"} value={credentialSubject.hasCredential.description} /> : ""}
                        {credentialSubject.hasCredential.competencyRequired? <SubjectItem label={"Competency Required"} value={credentialSubject.hasCredential.competencyRequired} /> : ""}
                        {credentialSubject.hasCredential.credentialCategory? <SubjectItem label={"Category"} value={credentialSubject.hasCredential.credentialCategory} /> : ""}
                      </>
                      : 
                      ("")}
                  {(credentialSubject.degree && credentialSubject.degree instanceof Object && credentialSubject.degree.constructor === Object)?
                      <>
                        <div className='text-center font-mono font-bold'>Degree</div>
                        {credentialSubject.degree.name? <SubjectItem label={"Name"} value={credentialSubject.degree.name} /> : ("")}
                        {credentialSubject.degree.type? <SubjectItem label={"Type"} value={credentialSubject.degree.type} /> : ""}
                      </>
                      : 
                      ("")}
                </div>)
      } 
      return ("")         
  })
  )

  const OtherInformationViewer = ()=>(
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <div className="">
        {credential?.id? <SubjectItem label={"ID"} value={credential.id} /> : ""}
        {credential?.description? <SubjectItem label={"Description"} value={credential.description} /> : ""}
        {credential?.validFrom? <SubjectItem label={"Description"} value={credential.validFrom} /> : ""}
        {credential?.validUntil? <SubjectItem label={"Valid Until"} value={credential.validUntil} /> : ""}
        {credential?.issuanceDate? <SubjectItem label={"Issuance Date"} value={credential.issuanceDate} /> : ""}
        {credential?.expirationDate? <SubjectItem label={"Expiration Date"} value={credential.expirationDate} /> : ""}
      </div>
    </div>
  )

  return (
    <Card className="w-full h-full mx-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-xl flex flex-col">
      <CardHeader className="space-y-2 pt-6 pb-2 flex-shrink-0">
        <CardTitle className="text-2xl font-mono font-bold bg-clip-text text-transparent text-gray-800 dark:text-gray-100 text-center">
          {credential?.name? credential?.name: "Credential"}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden px-6">
        <ScrollArea className="h-full pr-4">
            {/* -----------renderMethod View---------------- */}
            <div className="space-y-2">
              <RenderMethodSwitcherViewer />
              <div className='border-4 border-gray-300'>
              {renderCredential(currentRenderMethod as RenderMethod, credential as VerifiableCredential)}
            </div>
            {/* ------------------Types View----------------- */}
            {displayTypes.length > 0?
              (<div className="space-y-6">
                <Separator />
                <SectionLabel color="bg-blue-100  text-blue-800 dark:bg-blue-900 dark:text-blue-100">Types</SectionLabel>
                <TypesViewer />
              </div>)
              :
              ("")
            }
            {/* ------------------Issuer View---------------- */}
            {displayIssuer.length > 0?
              (
                <div className="space-y-4">
                  <Separator />
                  <SectionLabel color="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Issuer</SectionLabel>
                  <IssuerViewer />
                </div>
              )
              :
              ("")
            }
            {/* ---------------Credential Subject View------------- */}
            {displayCredentialSubject.length > 0?
              (
                <div className="space-y-4">
                  <Separator />
                  <SectionLabel color="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Credential Subject</SectionLabel>
                  <CredentialSubjectViewer />
                </div>
              )
              :
              ("")
            }
            {/* ---------------Other Infomation View------------- */}
            <div className="space-y-4">
              <Separator />
              <SectionLabel color="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">Other Information</SectionLabel>
              < OtherInformationViewer />
            </div>
          </div>
        </ScrollArea>
      </CardContent>
      <VerificationOverlay isVerified={verificationResult} />
      <CardFooter className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 flex justify-between items-center">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          onClick={handleGoBack}
        >
          <ArrowLeft className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          <span className="sr-only">Go back</span>
        </Button>
        <Button onClick={handleVerifyCredential} className="flex-grow bg-gradient-to-r from-gray-600 to-gray-700 text-white border-none hover:from-gray-700 hover:to-gray-800">
          {isVerifying ? "Verifying..." : (<><BookOpenCheck/> Verify Credential</>)}
        </Button>
      </CardFooter>
    </Card>
  )
}