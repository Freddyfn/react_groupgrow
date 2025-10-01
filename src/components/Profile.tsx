import React, { useState } from 'react';
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
  User, 
  Mail, 
  Phone, 
  Shield, 
  Bell, 
  CreditCard, 
  FileText, 
  Camera,
  Check,
  AlertCircle,
  Settings,
  Plus
} from 'lucide-react';

export function Profile() {
  const [profileData, setProfileData] = useState({
    firstName: 'María',
    lastName: 'García',
    email: 'maria.garcia@email.com',
    phone: '+1 234 567 8900',
    bio: 'Entusiasta de las inversiones grupales y el ahorro colaborativo.',
    riskProfile: 'moderate',
    monthlyIncome: '50000',
    investmentGoals: 'retirement'
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
    weeklyReports: true,
    paymentReminders: true
  });

  const [twoFAEnabled, setTwoFAEnabled] = useState(true);
  const [kycStatus, setKycStatus] = useState('verified'); // verified, pending, not_started

  const handleProfileUpdate = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
  };

  const saveProfile = () => {
    alert('Perfil actualizado exitosamente');
  };

  const saveNotifications = () => {
    alert('Configuración de notificaciones guardada');
  };

  const startKYCProcess = () => {
    alert('Redirigiendo al proceso de verificación KYC...');
  };

  const enable2FA = () => {
    alert('Se ha enviado un código QR a tu email para configurar 2FA');
  };

  const disable2FA = () => {
    if (confirm('¿Estás seguro de que quieres desactivar 2FA?')) {
      setTwoFAEnabled(false);
      alert('2FA desactivado');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src="" />
          <AvatarFallback className="text-lg">
            {profileData.firstName[0]}{profileData.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-3xl">{profileData.firstName} {profileData.lastName}</h1>
          <p className="text-muted-foreground">{profileData.email}</p>
          <div className="flex items-center space-x-2 mt-2">
            <Badge variant={kycStatus === 'verified' ? 'default' : 'secondary'}>
              {kycStatus === 'verified' ? (
                <>
                  <Check className="w-3 h-3 mr-1" />
                  KYC Verificado
                </>
              ) : kycStatus === 'pending' ? (
                <>
                  <AlertCircle className="w-3 h-3 mr-1" />
                  KYC Pendiente
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 mr-1" />
                  KYC No Iniciado
                </>
              )}
            </Badge>
            <Badge variant={twoFAEnabled ? 'default' : 'destructive'}>
              {twoFAEnabled ? (
                <>
                  <Shield className="w-3 h-3 mr-1" />
                  2FA Activo
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 mr-1" />
                  2FA Inactivo
                </>
              )}
            </Badge>
          </div>
        </div>
        <Button variant="outline">
          <Camera className="w-4 h-4 mr-2" />
          Cambiar Foto
        </Button>
      </div>

      {/* KYC Alert if not verified */}
      {kycStatus !== 'verified' && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="flex justify-between items-center">
              <div>
                <strong>Verificación KYC requerida</strong>
                <br />
                Completa tu verificación de identidad para acceder a todas las funcionalidades.
              </div>
              <Button onClick={startKYCProcess}>
                Iniciar Verificación
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="financial">Financiero</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>
                Actualiza tu información personal y preferencias
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => handleProfileUpdate('firstName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => handleProfileUpdate('lastName', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleProfileUpdate('email', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Biografía</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => handleProfileUpdate('bio', e.target.value)}
                  placeholder="Cuéntanos sobre ti..."
                  rows={3}
                />
              </div>

              <Button onClick={saveProfile}>
                Guardar Cambios
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Seguridad</CardTitle>
              <CardDescription>
                Gestiona tu seguridad y autenticación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Autenticación de Dos Factores (2FA)</h4>
                  <p className="text-sm text-muted-foreground">
                    Añade una capa extra de seguridad a tu cuenta
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={twoFAEnabled}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        enable2FA();
                        setTwoFAEnabled(true);
                      } else {
                        disable2FA();
                      }
                    }}
                  />
                  <span className="text-sm">
                    {twoFAEnabled ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Verificación KYC</h4>
                  <p className="text-sm text-muted-foreground">
                    Estado de verificación de identidad
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={kycStatus === 'verified' ? 'default' : 'secondary'}>
                    {kycStatus === 'verified' ? 'Verificado' : 'Pendiente'}
                  </Badge>
                  {kycStatus !== 'verified' && (
                    <Button variant="outline" size="sm" onClick={startKYCProcess}>
                      Verificar
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Cambiar Contraseña</h4>
                <div className="grid grid-cols-1 gap-4 max-w-md">
                  <div>
                    <Label htmlFor="currentPassword">Contraseña Actual</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">Nueva Contraseña</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="confirmNewPassword">Confirmar Nueva Contraseña</Label>
                    <Input id="confirmNewPassword" type="password" />
                  </div>
                  <Button className="w-fit">
                    Actualizar Contraseña
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Notificaciones</CardTitle>
              <CardDescription>
                Personaliza cómo y cuándo quieres recibir notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">
                      {key === 'emailAlerts' && 'Alertas por Email'}
                      {key === 'smsAlerts' && 'Alertas por SMS'}
                      {key === 'pushNotifications' && 'Notificaciones Push'}
                      {key === 'weeklyReports' && 'Reportes Semanales'}
                      {key === 'paymentReminders' && 'Recordatorios de Pago'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {key === 'emailAlerts' && 'Recibe notificaciones importantes por email'}
                      {key === 'smsAlerts' && 'Alertas urgentes vía mensaje de texto'}
                      {key === 'pushNotifications' && 'Notificaciones en tiempo real en la app'}
                      {key === 'weeklyReports' && 'Resumen semanal de tus inversiones'}
                      {key === 'paymentReminders' && 'Recordatorios antes de fechas de pago'}
                    </p>
                  </div>
                  <Switch 
                    checked={value}
                    onCheckedChange={(checked) => handleNotificationChange(key, checked)}
                  />
                </div>
              ))}

              <Button onClick={saveNotifications} className="mt-4">
                Guardar Configuración
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información Financiera</CardTitle>
              <CardDescription>
                Configura tus preferencias financieras y de inversión
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="monthlyIncome">Ingresos Mensuales (Opcional)</Label>
                <Select 
                  value={profileData.monthlyIncome}
                  onValueChange={(value) => handleProfileUpdate('monthlyIncome', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu rango de ingresos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under_30k">Menos de $30,000</SelectItem>
                    <SelectItem value="30k_50k">$30,000 - $50,000</SelectItem>
                    <SelectItem value="50k_80k">$50,000 - $80,000</SelectItem>
                    <SelectItem value="80k_120k">$80,000 - $120,000</SelectItem>
                    <SelectItem value="over_120k">Más de $120,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="riskProfile">Perfil de Riesgo</Label>
                <Select 
                  value={profileData.riskProfile}
                  onValueChange={(value) => handleProfileUpdate('riskProfile', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conservative">Conservador - Priorizo la seguridad</SelectItem>
                    <SelectItem value="moderate">Moderado - Balance entre riesgo y retorno</SelectItem>
                    <SelectItem value="aggressive">Agresivo - Busco máximo retorno</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="investmentGoals">Objetivos de Inversión</Label>
                <Select 
                  value={profileData.investmentGoals}
                  onValueChange={(value) => handleProfileUpdate('investmentGoals', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emergency_fund">Fondo de Emergencia</SelectItem>
                    <SelectItem value="vacation">Vacaciones</SelectItem>
                    <SelectItem value="house_down_payment">Enganche de Casa</SelectItem>
                    <SelectItem value="retirement">Jubilación</SelectItem>
                    <SelectItem value="education">Educación</SelectItem>
                    <SelectItem value="general_wealth">Crecimiento de Patrimonio</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Métodos de Pago</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">PayPal</p>
                        <p className="text-sm text-muted-foreground">maria.garcia@email.com</p>
                      </div>
                    </div>
                    <Badge variant="default">Principal</Badge>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Método de Pago
                  </Button>
                </div>
              </div>

              <Button onClick={saveProfile}>
                Guardar Configuración Financiera
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}