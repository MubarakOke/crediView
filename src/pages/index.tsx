import React, { useState, useEffect } from 'react';
import { VerifiableCredential } from '@/types/credential';

export default function App() {
  const [credential, setCredential] = useState<VerifiableCredential | null>(null)
  const [openViewer, setOpenViewer] = useState<boolean>(false)

  return (
    <div className="w-[350px] h-[540px] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-xl">
      {openViewer? 
                  <CredentialViewer credential={credential} setOpenViewer={setOpenViewer} setCredential={setCredential}/> 
                  :
                  <CredentialLoader setCredential={setCredential} setOpenViewer={setOpenViewer} credential={credential} />
      }
    </div>
  );
}