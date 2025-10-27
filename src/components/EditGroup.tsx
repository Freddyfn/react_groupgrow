import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon, Users, Target, DollarSign, ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// Simple date formatter
const formatDate = (date: Date) => {
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export function EditGroup() {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    groupName: '',
    groupType: '', // 'investment' or 'saving'
    description: '',
    goal: '',
    targetAmount: '',
    deadline: undefined as Date | undefined,
    maxMembers: '',
    privacy: '', // 'public' or 'private'
    invitationCode: '',
    contributionFrequency: '', // 'weekly', 'monthly', 'quarterly'
    minimumContribution: '',
    riskLevel: '', // 'low', 'medium', 'high'
    category: '' // 'education', 'travel', 'emergency', 'retirement', 'business', 'other'
  });
  const [error, setError] = useState('');

  // Mock: Cargar datos del grupo
  useEffect(() => {
    // Simulamos la carga de datos del grupo
    const mockGroupData = {
      groupName: 'Ahorro para Vacaciones 2025',
      groupType: 'saving',
      description: 'Ahorrar para unas vacaciones familiares en Europa visitando París, Roma y Barcelona',
      goal: 'Vacaciones familiares en Europa',
      targetAmount: '50000',
      deadline: new Date(2025, 11, 31), // 31 de diciembre 2025
      maxMembers: '20',
      privacy: 'public',
      invitationCode: '',
      contributionFrequency: 'monthly',
      minimumContribution: '500',
      riskLevel: '',
      category: 'travel'
    };

    // Simular un pequeño delay de carga
    setTimeout(() => {
      setFormData(mockGroupData);
      setIsLoading(false);
    }, 500);
  }, [groupId]);

  const handleInputChange = (field: string, value: string | Date | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.groupName || !formData.groupType || !formData.goal || !formData.targetAmount) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    if (parseInt(formData.targetAmount) <= 0) {
      setError('El monto objetivo debe ser mayor a 0');
      return;
    }

    if (formData.maxMembers && parseInt(formData.maxMembers) < 2) {
      setError('El grupo debe tener al menos 2 miembros');
      return;
    }

    // Simulate saving changes
    toast.success(`Grupo "${formData.groupName}" actualizado exitosamente`);
    navigate('/my-groups');
  };

  const groupCategories = [
    { value: 'education', label: 'Educación' },
    { value: 'travel', label: 'Viajes' },
    { value: 'emergency', label: 'Fondo de Emergencia' },
    { value: 'retirement', label: 'Jubilación' },
    { value: 'business', label: 'Negocio' },
    { value: 'home', label: 'Vivienda' },
    { value: 'health', label: 'Salud' },
    { value: 'other', label: 'Otro' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando datos del grupo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/my-groups')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Mis Grupos
          </Button>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                Editar Grupo
              </CardTitle>
              <CardDescription>
                Modifica la configuración y objetivos de tu grupo
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Información Básica */}
                <div className="space-y-4">
                  <h3 className="text-lg">Información Básica</h3>
                  
                  <div>
                    <Label htmlFor="groupName">Nombre del Grupo *</Label>
                    <Input
                      id="groupName"
                      value={formData.groupName}
                      onChange={(e) => handleInputChange('groupName', e.target.value)}
                      placeholder="Ej: Ahorro para Vacaciones 2025"
                    />
                  </div>

                  <div>
                    <Label>Tipo de Grupo *</Label>
                    <RadioGroup 
                      value={formData.groupType} 
                      onValueChange={(value) => handleInputChange('groupType', value)}
                      className="flex space-x-6 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="saving" id="saving" />
                        <Label htmlFor="saving">Ahorro</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="investment" id="investment" />
                        <Label htmlFor="investment">Inversión</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe el propósito y objetivos del grupo..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Categoría</Label>
                    <Select 
                      value={formData.category}
                      onValueChange={(value) => handleInputChange('category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {groupCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Objetivos Financieros */}
                <div className="space-y-4">
                  <h3 className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Objetivos Financieros
                  </h3>
                  
                  <div>
                    <Label htmlFor="goal">Meta Específica *</Label>
                    <Input
                      id="goal"
                      value={formData.goal}
                      onChange={(e) => handleInputChange('goal', e.target.value)}
                      placeholder="Ej: Comprar un auto, Viaje a Europa, Fondo de emergencia"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="targetAmount">Monto Objetivo * ($)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="targetAmount"
                          type="number"
                          value={formData.targetAmount}
                          onChange={(e) => handleInputChange('targetAmount', e.target.value)}
                          placeholder="50000"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Fecha Límite</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.deadline ? formatDate(formData.deadline) : "Seleccionar fecha"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.deadline}
                            onSelect={(date) => handleInputChange('deadline', date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contributionFrequency">Frecuencia de Aportes</Label>
                      <Select 
                        value={formData.contributionFrequency}
                        onValueChange={(value) => handleInputChange('contributionFrequency', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar frecuencia" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Semanal</SelectItem>
                          <SelectItem value="monthly">Mensual</SelectItem>
                          <SelectItem value="quarterly">Trimestral</SelectItem>
                          <SelectItem value="flexible">Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="minimumContribution">Aporte Mínimo ($)</Label>
                      <Input
                        id="minimumContribution"
                        type="number"
                        value={formData.minimumContribution}
                        onChange={(e) => handleInputChange('minimumContribution', e.target.value)}
                        placeholder="100"
                      />
                    </div>
                  </div>

                  {formData.groupType === 'investment' && (
                    <div>
                      <Label>Nivel de Riesgo</Label>
                      <RadioGroup 
                        value={formData.riskLevel} 
                        onValueChange={(value) => handleInputChange('riskLevel', value)}
                        className="flex space-x-6 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="low" id="low" />
                          <Label htmlFor="low">Bajo</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="medium" id="medium" />
                          <Label htmlFor="medium">Medio</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="high" id="high" />
                          <Label htmlFor="high">Alto</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}
                </div>

                {/* Configuración del Grupo */}
                <div className="space-y-4">
                  <h3 className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Configuración del Grupo
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="maxMembers">Número Máximo de Miembros</Label>
                      <Input
                        id="maxMembers"
                        type="number"
                        value={formData.maxMembers}
                        onChange={(e) => handleInputChange('maxMembers', e.target.value)}
                        placeholder="10"
                        min="2"
                        max="50"
                      />
                    </div>

                    <div>
                      <Label>Privacidad</Label>
                      <RadioGroup 
                        value={formData.privacy} 
                        onValueChange={(value) => handleInputChange('privacy', value)}
                        className="flex space-x-6 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="public" id="public" />
                          <Label htmlFor="public">Público</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="private" id="private" />
                          <Label htmlFor="private">Privado</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  {formData.privacy === 'private' && (
                    <div>
                      <Label htmlFor="invitationCode">Código de Invitación (Opcional)</Label>
                      <Input
                        id="invitationCode"
                        value={formData.invitationCode}
                        onChange={(e) => handleInputChange('invitationCode', e.target.value)}
                        placeholder="Ej: VACACIONES2025"
                      />
                    </div>
                  )}
                </div>

                <div className="flex space-x-4 pt-6">
                  <Button type="submit" className="flex-1">
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Cambios
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate('/my-groups')}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
