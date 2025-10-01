import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Plus, 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign, 
  Calendar,
  Bot,
  AlertCircle
} from 'lucide-react';

export function Dashboard() {
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  // Mock data
  const personalStats = {
    totalSaved: 12500,
    totalInvested: 8500,
    monthlyGrowth: 8.5,
    activeGroups: 3
  };

  const performanceData = [
    { month: 'Ene', amount: 5000 },
    { month: 'Feb', amount: 6200 },
    { month: 'Mar', amount: 7800 },
    { month: 'Abr', amount: 9200 },
    { month: 'May', amount: 10800 },
    { month: 'Jun', amount: 12500 }
  ];

  const portfolioData = [
    { name: 'Acciones', value: 45, color: '#8884d8' },
    { name: 'Bonos', value: 30, color: '#82ca9d' },
    { name: 'Criptomonedas', value: 15, color: '#ffc658' },
    { name: 'Efectivo', value: 10, color: '#ff7300' }
  ];

  const groups = [
    {
      id: 1,
      name: 'Vacaciones Familia 2025',
      members: 4,
      target: 10000,
      current: 6500,
      monthlyContribution: 500,
      deadline: '2025-06-01',
      status: 'active'
    },
    {
      id: 2,
      name: 'Fondo Emergencia Amigos',
      members: 6,
      target: 15000,
      current: 12000,
      monthlyContribution: 400,
      deadline: '2025-12-01',
      status: 'active'
    },
    {
      id: 3,
      name: 'Inversión Tech Startup',
      members: 8,
      target: 25000,
      current: 18500,
      monthlyContribution: 600,
      deadline: '2026-03-01',
      status: 'pending_vote'
    }
  ];

  const aiTips = [
    "Considera aumentar tu aporte mensual en un 5% para acelerar tus objetivos",
    "Tus grupos están rindiendo bien, pero 'Inversión Tech Startup' necesita tu voto",
    "Es un buen momento para diversificar: considera invertir en bonos verdes"
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl mb-2">Mi Dashboard</h1>
          <p className="text-muted-foreground">
            Administra tus inversiones y grupos de ahorro
          </p>
        </div>
        <Button asChild>
          <Link to="/create-group">
            <Plus className="mr-2 h-4 w-4" />
            Crear Grupo
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Ahorrado</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">${personalStats.totalSaved.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Invertido</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">${personalStats.totalInvested.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{personalStats.monthlyGrowth}% este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Grupos Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{personalStats.activeGroups}</div>
            <p className="text-xs text-muted-foreground">
              2 necesitan tu atención
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Próximo Pago</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">$1,500</div>
            <p className="text-xs text-muted-foreground">
              En 5 días
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Evolución de Ahorros</CardTitle>
            <CardDescription>
              Tu progreso de ahorro en los últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribución de Portfolio</CardTitle>
            <CardDescription>
              Cómo están distribuidas tus inversiones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={portfolioData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {portfolioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {portfolioData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Groups Section */}
      <Card>
        <CardHeader>
          <CardTitle>Mis Grupos de Inversión</CardTitle>
          <CardDescription>
            Gestiona tus grupos de ahorro e inversión
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {groups.map((group) => (
            <div key={group.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">{group.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Users className="w-4 h-4 mr-1" />
                    {group.members} miembros
                    <Target className="w-4 h-4 mr-1 ml-3" />
                    Meta: ${group.target.toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {group.status === 'pending_vote' && (
                    <Badge variant="destructive">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Voto Pendiente
                    </Badge>
                  )}
                  <Badge variant={group.status === 'active' ? 'default' : 'secondary'}>
                    {group.status === 'active' ? 'Activo' : 'Pendiente'}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progreso: ${group.current.toLocaleString()}</span>
                  <span>{Math.round((group.current / group.target) * 100)}%</span>
                </div>
                <Progress value={(group.current / group.target) * 100} />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Aporte mensual: ${group.monthlyContribution}</span>
                  <span>Vence: {new Date(group.deadline).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex justify-end mt-3">
                <Button variant="outline" asChild>
                  <Link to={`/group/${group.id}`}>
                    Ver Detalles
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* AI Assistant */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bot className="w-5 h-5 mr-2 text-primary" />
              <CardTitle>Asistente IA</CardTitle>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAIAssistant(!showAIAssistant)}
            >
              {showAIAssistant ? 'Ocultar' : 'Mostrar'} Consejos
            </Button>
          </div>
          <CardDescription>
            Recomendaciones personalizadas para optimizar tus inversiones
          </CardDescription>
        </CardHeader>
        {showAIAssistant && (
          <CardContent>
            <div className="space-y-3">
              {aiTips.map((tip, index) => (
                <div key={index} className="flex items-start p-3 bg-muted/50 rounded-lg">
                  <Bot className="w-4 h-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
                  <p className="text-sm">{tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}