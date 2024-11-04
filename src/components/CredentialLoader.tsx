'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X, Bell, BookOpenText, Trash2, File  } from 'lucide-react'
import isUrl from 'is-url';
import { Notification, propsData } from '@/types/app';

export default function Loader( { setCredential, setOpenViewer, credential }: propsData ) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [notification, setNotification] = useState<Notification | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  useEffect(() => {
    const checkClipboard = async () => {
      try {
        const text = await navigator.clipboard.readText()
        checkForJson(text, 'clipboard')
      } catch (err) {
        console.error('Failed to read clipboard contents: ', err)
      }
    }

    checkClipboard()
  }, [])

  const normalizeCredential = (content: any) =>{
    
    let normalizedContent = {
      ...content
    }

    // normalized issuers as issuer
    if (content?.issuer || content?.issuers){
      const value = content?.issuer || content?.issuers;
      normalizedContent["issuer"] = value
    }
    
    
    return normalizedContent; 
  }

  const checkForJson = (content: string, source: string) => {
    try {
      const contentObj = JSON.parse(content)  
      
      if( contentObj.type || contentObj.issuer || contentObj.issuers || contentObj['@context'] || contentObj.credentialSubject ){
        setCredential(normalizeCredential(contentObj))
        setNotification({message: `Valid Credential JSON detected from ${source}`, status: true})
        return true
      }
      else{
        return false
      }
    } catch (e) {
      return false
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()

    setNotification(null)
    setCredential(null)
    if (textareaRef.current) {textareaRef.current.value = ''}

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    
    setNotification(null)
    setCredential(null)
    if (textareaRef.current) {textareaRef.current.value = ''}

    if (file) {
      handleFile(file)
    }
  }

  const handleFile = (file: File) => {
    setUploadedFile(file)
    const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        const certificateValidity = checkForJson(content, 'file')
        if (!certificateValidity){
          setNotification({message: 'Invalid Credential JSON file dropped', status: false})
        }
      }
      reader.readAsText(file)
  }

  const handleRemoveFile = () => {
    setNotification(null)
    setUploadedFile(null)
    setCredential(null)
    if (fileInputRef.current) { fileInputRef.current.value = ''}
  }

  const handleInputChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let content = e.target.value
    
    setNotification(null)
    setCredential(null)
    if (fileInputRef.current) {fileInputRef.current.value = ''}
    
    if (isUrl(content)) { 
        try{
          const response = await fetch(content);

            if (response.ok) { content = await response.text() }

            const certificateValidity = checkForJson(content, 'URL')

            if (!certificateValidity) { setNotification({message: 'Invalid Credential JSON in URL', status: false}) }
        }
        catch{
          setNotification({message: 'Error loading URL', status: false})
        }
    }
    else{
      checkForJson(content, 'input')
    }
    
  }

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    let pastedContent = e.clipboardData.getData('text')

    if (isUrl(pastedContent)) { 
      try{
         const response = await fetch(pastedContent);

          if (response.ok) { pastedContent = await response.text() }

          const certificateValidity = checkForJson(pastedContent, 'URL')

          if (!certificateValidity) { 
            setNotification({message: 'Invalid Credential JSON in URL', status: false})
            e.preventDefault()
          }
      }
      catch{
        setNotification({message: 'Error loading URL', status: false})
      }
  }
  else{  
      const certificateValidity = checkForJson(pastedContent, 'paste')

      if (!certificateValidity){
        setNotification({message: 'Invalid Credential JSON pasted', status: false})
        e.preventDefault()
      }
}
  }

  const handleQrError = (errorMessage: string) => {
    console.error('QR scan error:', errorMessage)
  }

  return (
    <Card className="mx-auto overflow-hidden relative">
      {notification && (
        <div className={`absolute top-0 left-0 right-0 z-10 text-white px-4 py-2 flex items-center justify-between ${notification?.status ? "bg-green-500" : "bg-red-500"}`}>
          <div className="flex items-center">
            <Bell className="w-4 h-4 mr-2" />
            <span>{notification?.message}</span>
          </div>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNotification(null)}
              className="text-white hover:bg-blue-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
      <CardHeader className="pb-10">
        <CardTitle className='font-bold bg-clip-text text-center text-transparent text-gray-800 dark:text-gray-100'>Verifiable Credential Viewer</CardTitle>
        <CardDescription className='text-gray-600 text-center dark:text-gray-300'>Upload or paste your verifiable credential</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div 
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => !uploadedFile && fileInputRef.current?.click()}
        >
          {uploadedFile ? (
            <div className="flex items-center justify-between p-8">
              <div className="flex items-center">
                <File className="w-8 h-8 text-gray-400 dark:text-gray-500 mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">{uploadedFile.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemoveFile()
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <>
              <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Drag and drop your file here, or click to select a file</p>
            </>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept=".json"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="input-area" className="text-sm font-medium text-gray-700 dark:text-gray-300">Or enter your JSON credential here:</label>
          <Textarea 
            id="input-area"
            ref={textareaRef}
            placeholder="Enter or paste your JSON credential or URL to the JSON here" 
            className="min-h-[140px] bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 focus:border-gray-500 dark:focus:border-gray-400 focus:ring-gray-500 dark:focus:ring-gray-400"
            onChange={handleInputChange}
            onPaste={handlePaste}
          />
        </div>

        <div className="mt-6">
            {credential ? (<Button onClick={()=>setOpenViewer(true)} className="w-full mt-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white border-none hover:from-gray-700 hover:to-gray-800">
                             <BookOpenText className="mr-2 h-4 w-4" /> View Document
                          </Button>) : ''}
        </div>
      </CardContent>
    </Card>
  )
}