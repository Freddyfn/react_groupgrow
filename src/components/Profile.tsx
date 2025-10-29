import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- 1. IMPORTAR useNavigate
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import {
  User, Mail, Phone, Shield, Bell, CreditCard, FileText, Camera, Check,
  AlertCircle, Settings, Plus,
  // --- Iconos añadidos (ShieldCheck, Loader2 YA NO SE USAN AQUÍ) ---
} from 'lucide-react';

// --- IMPORTS DE DIÁLOGO Y 2FA ELIMINADOS ---
// import { Dialog, ... } from './ui/dialog';
// import { InputOTP, ... } from './ui/input-otp';
// import axios from 'axios'; // <-- YA NO SE USA AQUÍ
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate(); // <-- 2. INICIALIZAR useNavigate

  // Estados del perfil (sin cambios)
  const [profileData, setProfileData] = useState({
    firstName: 'Cargando...', lastName: '', email: 'Cargando...', phone: '', bio: '',
    riskProfile: 'moderate', monthlyIncome: '', investmentGoals: ''
  });
  const [notifications, setNotifications] = useState({
    emailAlerts: true, smsAlerts: false, pushNotifications: true,
    weeklyReports: true, paymentReminders: true
  });
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [kycStatus, setKycStatus] = useState('pending');

  // --- ESTADOS PARA EL DIÁLOGO 2FA ELIMINADOS ---
  // const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);
  // ... (todos los estados de QR, OTP, Error, Carga) ...

  // useEffect para cargar datos (sin cambios)
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          // --- Simulación ---
          console.log(`Simulando carga de datos para usuario ID: ${user.id}`);
          await new Promise(resolve => setTimeout(resolve, 500));
          const userDataFromApi = {
            firstName: user.name.split(' ')[0] || 'Usuario', lastName: user.name.split(' ')[1] || 'Demo',
            email: user.email, phone: '+1234567890', bio: 'Bio simulada.',
            riskProfile: 'moderate',
            twofaEnabled: false, // <-- TODO: Reemplaza con llamada API real
            kycStatus: 'verified' // <-- TODO: Reemplaza con llamada API real
          };
          // --- Fin Simulación ---
          setProfileData(prev => ({ ...prev, firstName: userDataFromApi.firstName, lastName: userDataFromApi.lastName, email: userDataFromApi.email, phone: userDataFromApi.phone, bio: userDataFromApi.bio, riskProfile: userDataFromApi.riskProfile }));
          setTwoFAEnabled(userDataFromApi.twofaEnabled);
          setKycStatus(userDataFromApi.kycStatus);
        } catch (error) {
          console.error("Error al cargar datos del perfil", error);
          toast.error("No se pudieron cargar los datos del perfil.");
          setProfileData(prev => ({ ...prev, firstName: 'Error', lastName: 'Carga', email: user?.email || '' }));
        }
      } else {
         setProfileData({ firstName: '', lastName: '', email: '', phone: '', bio: '', riskProfile: 'moderate', monthlyIncome: '', investmentGoals: '' });
         setTwoFAEnabled(false);
         setKycStatus('pending');
      }
    };
    fetchUserData();
  }, [user]);

  // Funciones de manejo (sin cambios)
  const handleProfileUpdate = (field: string, value: string) => setProfileData(prev => ({ ...prev, [field]: value }));
  const handleNotificationChange = (field: string, value: boolean) => setNotifications(prev => ({ ...prev, [field]: value }));
  const saveProfile = () => { if (!user) return; toast.success('Perfil actualizado (simulado)'); };
  const saveNotifications = () => { toast.success('Notificaciones guardadas (simulado)'); };
  const startKYCProcess = () => { toast.info('Iniciando KYC... (simulado)'); };

  // --- LÓGICA DE 2FA (MOVIDA A Activate2FA.tsx) ---
  // const handleGenerateQr = async () => { ... };
  // const handleVerifyAndEnable = async () => { ... };

  // --- 3. NUEVOS MANEJADORES DE 2FA ---
  const enable2FA = () => {
    // Simplemente redirige a la página de activación
    navigate('/activate-2fa');
  };

  const disable2FA = async () => {
    if (!user) return;
    if (confirm('¿Desactivar Autenticación de Dos Factores?')) {
      try {
        // TODO: Endpoint backend para desactivar
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulación
        setTwoFAEnabled(false);
        toast.warning('Autenticación de Dos Factores desactivada.');
      } catch (error) {
         toast.error("No se pudo desactivar 2FA.");
      }
    }
  };


  // --- RENDERIZADO DEL COMPONENTE ---
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header (sin cambios) */}
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src="" alt={`${profileData.firstName} ${profileData.lastName}`} />
          <AvatarFallback className="text-lg">
            {profileData.firstName?.[0]}{profileData.lastName?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-3xl font-semibold">{profileData.firstName} {profileData.lastName}</h1>
          <p className="text-muted-foreground">{profileData.email}</p>
          <div className="flex items-center space-x-2 mt-2">
            <Badge variant={kycStatus === 'verified' ? 'default' : 'secondary'}>
              {kycStatus === 'verified' ? ( <><Check className="w-3 h-3 mr-1" />KYC Verificado</> ) : kycStatus === 'pending' ? ( <><AlertCircle className="w-3 h-3 mr-1" />KYC Pendiente</> ) : ( <><AlertCircle className="w-3 h-3 mr-1" />KYC No Iniciado</> )}
            </Badge>
            <Badge variant={twoFAEnabled ? 'default' : 'destructive'}>
              {twoFAEnabled ? ( <><Shield className="w-3 h-3 mr-1" />2FA Activo</> ) : ( <><AlertCircle className="w-3 h-3 mr-1" />2FA Inactivo</> )}
            </Badge>
          </div>
        </div>
        <Button variant="outline"><Camera className="w-4 h-4 mr-2" />Cambiar Foto</Button>
      </div>

      {/* Alerta KYC (sin cambios) */}
      {kycStatus !== 'verified' && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="flex justify-between items-center">
              <div><strong>Verificación KYC requerida</strong><br />Completa tu verificación para acceder a todas las funciones.</div>
              <Button onClick={startKYCProcess} size="sm">Iniciar Verificación</Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs Principales (sin cambios) */}
      <Tabs defaultValue="security" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="financial">Financiero</TabsTrigger>
        </TabsList>

        {/* --- PESTAÑA PERFIL --- (Sin cambios) */}
        <TabsContent value="profile" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>Actualiza tu información personal y preferencias.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="firstName">Nombre</Label><Input id="firstName" value={profileData.firstName} onChange={(e) => handleProfileUpdate('firstName', e.target.value)} /></div>
                <div><Label htmlFor="lastName">Apellido</Label><Input id="lastName" value={profileData.lastName} onChange={(e) => handleProfileUpdate('lastName', e.target.value)} /></div>
              </div>
              <div><Label htmlFor="email">Email</Label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="email" type="email" value={profileData.email} disabled className="pl-10" /></div></div>
              <div><Label htmlFor="phone">Teléfono</Label><div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="phone" value={profileData.phone} onChange={(e) => handleProfileUpdate('phone', e.target.value)} className="pl-10" placeholder="+1 234 567 8900" /></div></div>
              <div><Label htmlFor="bio">Biografía</Label><Textarea id="bio" value={profileData.bio} onChange={(e) => handleProfileUpdate('bio', e.target.value)} placeholder="Cuéntanos un poco sobre ti..." rows={3} /></div>
              <Button onClick={saveProfile}>Guardar Cambios</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- PESTAÑA SEGURIDAD --- (Switch actualizado) */}
        <TabsContent value="security" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Seguridad</CardTitle>
              <CardDescription>Gestiona la seguridad y autenticación de tu cuenta.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* --- 4. SECCIÓN 2FA ACTUALIZADA --- */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Autenticación de Dos Factores (2FA)</h4>
                  <p className="text-sm text-muted-foreground">Añade seguridad con una app autenticadora.</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="twoFA-switch"
                    checked={twoFAEnabled}
                    onCheckedChange={(checked) => {
                      // Lógica actualizada para usar los nuevos manejadores
                      if (checked && !twoFAEnabled) {
                        enable2FA(); // <-- Redirige a la página
                      } else if (!checked && twoFAEnabled) {
                        disable2FA();
                      }
                    }}
                  />
                  <Label htmlFor="twoFA-switch" className="text-sm cursor-pointer">
                    {twoFAEnabled ? 'Activado' : 'Desactivado'}
                  </Label>
                </div>
              </div>

              {/* Sección KYC (sin cambios) */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div><h4 className="font-medium">Verificación KYC</h4><p className="text-sm text-muted-foreground">Estado de verificación de identidad.</p></div>
                <div className="flex items-center space-x-2">
                  <Badge variant={kycStatus === 'verified' ? 'default' : kycStatus === 'pending' ? 'secondary' : 'outline'}>{kycStatus === 'verified' ? 'Verificado' : kycStatus === 'pending' ? 'Pendiente' : 'No Iniciado'}</Badge>
                  {kycStatus !== 'verified' && (<Button variant="outline" size="sm" onClick={startKYCProcess}>{kycStatus === 'pending' ? 'Ver Estado' : 'Iniciar'}</Button>)}
                </div>
              </div>

              {/* Sección Cambiar Contraseña (sin cambios) */}
              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium">Cambiar Contraseña</h4>
                <div className="grid grid-cols-1 gap-4 max-w-md">
                  <div><Label htmlFor="currentPassword">Contraseña Actual</Label><Input id="currentPassword" type="password" /></div>
                  <div><Label htmlFor="newPassword">Nueva Contraseña</Label><Input id="newPassword" type="password" /></div>
                  <div><Label htmlFor="confirmNewPassword">Confirmar Nueva Contraseña</Label><Input id="confirmNewPassword" type="password" /></div>
                  <Button className="w-fit" onClick={() => toast.info('Funcionalidad no implementada')}>Actualizar Contraseña</Button>
                </div>
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        {/* --- PESTAÑAS NOTIFICATIONS y FINANCIAL --- (Sin cambios) */}
        <TabsContent value="notifications" className="space-y-6 mt-6">
           {/* ... (tu código existente) ... */}
        </TabsContent>
        <TabsContent value="financial" className="space-y-6 mt-6">
           {/* ... (tu código existente) ... */}
        </TabsContent>

      </Tabs>

      {/* --- 5. DIÁLOGO 2FA ELIMINADO --- */}
      {/* <Dialog open={isQrDialogOpen} onOpenChange={setIsQrDialogOpen}> ... </Dialog> */}

    </div> // Cierre del div principal
  );
}