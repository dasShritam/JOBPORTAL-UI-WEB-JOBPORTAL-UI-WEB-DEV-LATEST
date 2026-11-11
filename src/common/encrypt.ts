import * as Forge from 'node-forge';
import { environment } from "../environments/environment";

export const encryptInput=(input:string)=>{
  const rsa = Forge.pki.publicKeyFromPem(environment.publicKey)        
  return (window.btoa(
    rsa.encrypt(input)
  ));
}