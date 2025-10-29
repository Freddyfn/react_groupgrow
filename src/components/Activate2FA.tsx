import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
// --- 1. IMPORTACIONES CAMBIADAS ---
// Se quita InputOTP, InputOTPGroup, InputOTPSlot
import { Input } from './ui/input'; // <-- Se añade el Input normal
// ---
import { ShieldCheck, AlertCircle, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export function Activate2FA() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [qrCodeBase64, setQrCodeBase64] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isLoadingQr, setIsLoadingQr] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [qrError, setQrError] = useState('');

  // useEffect (sin cambios)
  useEffect(() => {
    const generateQR = async () => {
      if (!user) {
        toast.error("Usuario no autenticado, redirigiendo.");
        navigate('/login');
        return;
      }
      setIsLoadingQr(true);
      setQrError('');
      try {
        const response = await axios.post('/api/auth/2fa/generate-qr', { userId: user.id });
        setQrCodeBase64(response.data.qrCodeBase64);
        setSecretKey(response.data.secretKey || 'NO-PROVISTA-POR-BACKEND'); 
      } catch (err) {
        console.error("Error al generar QR:", err);
        setQrError('No se pudo generar el código QR. Por favor, recarga la página.');
      } finally {
        setIsLoadingQr(false);
      }
    };
    generateQR();
  }, [user, navigate]);

  // handleVerify2FA (sin cambios)
  const handleVerify2FA = async () => {
    if (!user || otpCode.length !== 6) return;
    setIsVerifying(true);
    setQrError('');
    try {
      await axios.post('/api/auth/2fa/enable-verify', { userId: user.id, code: otpCode });
      toast.success('¡2FA activado exitosamente!', { description: 'Tu cuenta ahora está protegida.' });
      setTimeout(() => navigate('/profile'), 1500);
    } catch (err) {
      console.error("Error al verificar código:", err);
      setQrError('Código incorrecto o expirado. Intenta de nuevo.');
      setOtpCode('');
    } finally {
      setIsVerifying(false);
    }
  };

  // handleCancel (sin cambios)
  const handleCancel = () => {
    navigate('/profile');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-2xl">
        {/* CardHeader (sin cambios) */}
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            Configurar Seguridad de Dos Pasos
          </CardTitle>
          <CardDescription className="text-base">
            Sigue estos pasos para proteger tu cuenta usando tu aplicación de autenticación.
          </CardDescription>
        </CardHeader>

        {/* CardContent (Paso 1 sin cambios) */}
        <CardContent className="space-y-8 pt-6">
          {/* Paso 1: Código QR (sin cambios) */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-base font-semibold flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">
                  1
                </span>
                Abre tu app de autenticación y escanea el código QR
              </Label>
              <p className="text-sm text-muted-foreground pl-8">
                Recomendamos usar Google Authenticator, Authy o Microsoft Authenticator.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 py-4">
              {isLoadingQr ? (
                <div className="w-64 h-64 flex flex-col items-center justify-center bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
                  <p className="text-sm text-muted-foreground">Generando código QR...</p>
                </div>
              ) : qrCodeBase64 ? (
                <>
                  <div className="p-6 bg-white dark:bg-white border-2 border-muted rounded-xl shadow-lg">
                    <img 
                      src={qrCodeBase64} 
                      alt="Código QR para 2FA"
                      className="w-52 h-52 object-cover rounded-lg"
                    />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      ¿No puedes escanear el código?
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <p className="text-xs text-muted-foreground">
                        Ingresa esta clave manualmente:
                      </p>
                      <code className="px-2 py-1 bg-muted rounded text-xs font-mono font-semibold">
                        {secretKey}
                      </code>
                    </div>
                  </div>
                </>
              ) : (
                 <div className="w-64 h-64 flex flex-col items-center justify-center bg-muted/50 rounded-lg border-2 border-dashed border-destructive/20">
                  <AlertCircle className="h-8 w-8 text-destructive mb-3" />
                  <p className="text-sm text-destructive text-center px-4">{qrError || 'Error desconocido'}</p>
                </div>
              )}
            </div>
          </div>

          {/* Separador visual */}
          <div className="border-t" />

          {/* --- 2. PASO 2: CÓDIGO TOTP (MODIFICADO) --- */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-base font-semibold flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">
                  2
                </span>
                Ingresa el código de 6 dígitos
              </Label>
              <p className="text-sm text-muted-foreground pl-8">
                Introduce el código que muestra tu aplicación de autenticación.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-4 py-4">
              {/* --- AQUÍ ESTÁ EL CAMBIO --- */}
              <Input
                id="otp-code"
                type="text" // Usar "text" para controlar el input
                inputMode="numeric" // Mejora la experiencia en móviles
                pattern="[0-9]*"
                autoComplete="one-time-code"
                maxLength={6}
                value={otpCode}
                onChange={(e) => {
                  // Forzar que solo sean números
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setOtpCode(value);
                  setQrError(''); // Limpia error al escribir
                }}
                disabled={isVerifying || isLoadingQr || !qrCodeBase64}
                className="w-48 text-center text-2xl tracking-[0.3em] font-mono" // Estilos para que parezca un input de código
                placeholder="••••••"
              />
              {/* --- FIN DEL CAMBIO --- */}

              {otpCode.length === 6 && !isVerifying && !qrError && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Código completo, listo para verificar</span>
                </div>
              )}
            </div>

            {/* Área de Error (sin cambios) */}
            {qrError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{qrError}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Nota de seguridad (sin cambios) */}
          <div className="pt-4 border-t">
            <Alert>
              <ShieldCheck className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Importante:</strong> Una vez activado el 2FA, se te proporcionarán códigos de respaldo. 
                Guárdalos en un lugar seguro.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>

        {/* CardFooter (sin cambios) */}
        <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between pt-6">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={isVerifying}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Perfil
          </Button>
          <Button 
            onClick={handleVerify2FA}
            disabled={otpCode.length !== 6 || isVerifying || isLoadingQr || !qrCodeBase64}
            className="w-full sm:w-auto min-w-[180px]"
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                <ShieldCheck className="mr-2 h-4 w-4" />
                Verificar y Activar
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}