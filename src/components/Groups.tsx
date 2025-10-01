import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Users, Target, Lock, Search, UserPlus, Eye } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface PublicGroup {
  id: string;
  name: string;
  creator: string;
  objective: string;
  currentMembers: number;
  maxMembers: number;
  targetAmount: number;
  currentAmount: number;
  category: string;
  isPublic: boolean;
}

export function Groups() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [privateGroupCode, setPrivateGroupCode] = useState('');
  const [isJoiningPrivate, setIsJoiningPrivate] = useState(false);

  // Mock data para grupos públicos
  const [publicGroups] = useState<PublicGroup[]>([
    {
      id: '1',
      name: 'Ahorro para Vacaciones 2025',
      creator: 'María González',
      objective: 'Ahorrar para unas vacaciones familiares en Europa',
      currentMembers: 12,
      maxMembers: 20,
      targetAmount: 50000,
      currentAmount: 32500,
      category: 'Viajes',
      isPublic: true
    },
    {
      id: '2',
      name: 'Fondo de Emergencia Grupal',
      creator: 'Carlos Rodríguez',
      objective: 'Crear un fondo de emergencia colectivo para situaciones imprevistas',
      currentMembers: 8,
      maxMembers: 15,
      targetAmount: 100000,
      currentAmount: 67800,
      category: 'Emergencia',
      isPublic: true
    },
    {
      id: '3',
      name: 'Inversión en Criptomonedas',
      creator: 'Ana Martínez',
      objective: 'Diversificar portafolio invirtiendo en criptomonedas de forma responsable',
      currentMembers: 15,
      maxMembers: 25,
      targetAmount: 200000,
      currentAmount: 145000,
      category: 'Inversiones',
      isPublic: true
    },
    {
      id: '4',
      name: 'Compra de Casa Compartida',
      creator: 'Luis Hernández',
      objective: 'Ahorrar para el enganche de una propiedad inmobiliaria',
      currentMembers: 6,
      maxMembers: 10,
      targetAmount: 300000,
      currentAmount: 180000,
      category: 'Inmuebles',
      isPublic: true
    },
    {
      id: '5',
      name: 'Educación y Certificaciones',
      creator: 'Patricia Silva',
      objective: 'Financiar cursos y certificaciones profesionales para el equipo',
      currentMembers: 20,
      maxMembers: 30,
      targetAmount: 75000,
      currentAmount: 52500,
      category: 'Educación',
      isPublic: true
    },
    {
      id: '6',
      name: 'Startup Tech Colaborativa',
      creator: 'Andrés Torres',
      objective: 'Reunir capital para lanzar una startup tecnológica innovadora',
      currentMembers: 18,
      maxMembers: 25,
      targetAmount: 500000,
      currentAmount: 275000,
      category: 'Emprendimiento',
      isPublic: true
    }
  ]);

  const filteredGroups = publicGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.objective.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleJoinPublicGroup = (groupId: string) => {
    toast.success('¡Te has unido al grupo exitosamente!');
    navigate(`/group/${groupId}`);
  };

  const generatePrivateCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  };

  const handleJoinPrivateGroup = () => {
    if (!privateGroupCode.trim()) {
      toast.error('Por favor ingresa un código válido');
      return;
    }

    setIsJoiningPrivate(true);
    
    // Simular verificación del código
    setTimeout(() => {
      if (privateGroupCode.length === 8) {
        toast.success('¡Te has unido al grupo privado exitosamente!');
        navigate(`/group/private-${privateGroupCode}`);
      } else {
        toast.error('Código inválido. Verifica e intenta nuevamente.');
      }
      setIsJoiningPrivate(false);
      setPrivateGroupCode('');
    }, 1500);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Viajes': 'bg-blue-100 text-blue-800',
      'Emergencia': 'bg-red-100 text-red-800',
      'Inversiones': 'bg-green-100 text-green-800',
      'Inmuebles': 'bg-purple-100 text-purple-800',
      'Educación': 'bg-yellow-100 text-yellow-800',
      'Emprendimiento': 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-4">Explorar Grupos</h1>
          <p className="text-muted-foreground">
            Descubre grupos públicos para unirte o accede a un grupo privado con código
          </p>
        </div>

        {/* Actions Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Search Public Groups */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Buscar Grupos Públicos
                </CardTitle>
                <CardDescription>
                  Encuentra grupos públicos por nombre, creador, objetivo o categoría
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar grupos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Join Private Group */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Grupo Privado
                </CardTitle>
                <CardDescription>
                  Únete con código de invitación
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full" variant="outline">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Unirse con Código
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Unirse a Grupo Privado</DialogTitle>
                      <DialogDescription>
                        Ingresa el código de 8 caracteres que te proporcionó el creador del grupo
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="private-code">Código de Grupo</Label>
                        <Input
                          id="private-code"
                          placeholder="Ej: ABC123XY"
                          value={privateGroupCode}
                          onChange={(e) => setPrivateGroupCode(e.target.value.toUpperCase())}
                          maxLength={8}
                          className="uppercase tracking-wider"
                        />
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          <strong>Ejemplo de código:</strong> {generatePrivateCode()}
                        </p>
                      </div>
                      <Button 
                        onClick={handleJoinPrivateGroup}
                        disabled={isJoiningPrivate || privateGroupCode.length !== 8}
                        className="w-full"
                      >
                        {isJoiningPrivate ? 'Verificando...' : 'Unirse al Grupo'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Public Groups Grid */}
        <div className="space-y-6">
          <h2 className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Grupos Públicos ({filteredGroups.length})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <Card key={group.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={getCategoryColor(group.category)}>
                      {group.category}
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      {group.currentMembers}/{group.maxMembers}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                  <CardDescription className="text-sm">
                    Creado por <strong>{group.creator}</strong>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-start gap-2 mb-2">
                      <Target className="h-4 w-4 mt-1 text-primary" />
                      <p className="text-sm">{group.objective}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progreso</span>
                      <span>
                        ${group.currentAmount.toLocaleString()} / ${group.targetAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-secondary/30 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage(group.currentAmount, group.targetAmount)}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      {getProgressPercentage(group.currentAmount, group.targetAmount).toFixed(1)}% completado
                    </p>
                  </div>

                  <Button 
                    onClick={() => handleJoinPublicGroup(group.id)}
                    className="w-full"
                    disabled={group.currentMembers >= group.maxMembers}
                  >
                    {group.currentMembers >= group.maxMembers ? 'Grupo Lleno' : 'Unirse al Grupo'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredGroups.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No se encontraron grupos que coincidan con tu búsqueda</p>
                <p className="text-sm">Intenta con otros términos o explora todas las categorías</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setSearchTerm('')}
                className="mt-4"
              >
                Mostrar Todos los Grupos
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}