/**
 * This page is derived from web-verifier-plus licensed under the MIT License License.
 * Original source: https://github.com/digitalcredentials/web-verifier-plus.
 * License: See LICENCE/MIT.txt in the root of this project.
 */

import { checkStatus } from '@digitalcredentials/vc-bitstring-status-list';
import { checkStatus as checkStatusLegacy } from '@digitalcredentials/vc-status-list';
import { VerifiableCredential } from '@/types/credential';

export enum StatusPurpose {
  Revocation = 'revocation',
  Suspension = 'suspension'
}

export function getCredentialStatusChecker(credential: VerifiableCredential) {
  if (!credential.credentialStatus) {
    return null;
  }
  const credentialStatuses = Array.isArray(credential.credentialStatus) ?
    credential.credentialStatus :
    [credential.credentialStatus];
  const [credentialStatus] = credentialStatuses;
  switch (credentialStatus.type) {
  case 'BitstringStatusListEntry':
    return checkStatus;
  case 'StatusList2021Entry':
    return checkStatusLegacy;
  default:
    return null;
  }
}

export function hasStatusPurpose(
  credential: VerifiableCredential,
  statusPurpose: StatusPurpose
) {
  if (!credential.credentialStatus) {
    return false;
  }
  const credentialStatuses = Array.isArray(credential.credentialStatus) ?
    credential.credentialStatus :
    [credential.credentialStatus];
  return credentialStatuses.some(s => s.statusPurpose === statusPurpose);
}
