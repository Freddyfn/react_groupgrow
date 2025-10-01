import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { 
  Users, 
  Target, 
  DollarSign, 
  Calendar,
  TrendingUp,
  Vote,
  Clock,
  AlertCircle,
  CheckCircle,
  Bot,
  Download,
  MessageSquare,
  CreditCard
} from 'lucide-react';

export function GroupDashboard() {
  const { groupId } = useParams();
  const [timeLeft, setTimeLeft] = useState({ days: 15, hours: 8, minutes: 42 });
  const [showVotingModal, setShowVotingModal] = useState(false);

  // Mock data for the group
  const groupData = {
    id: groupId,
    name: 'Vacaciones Familia 2025',
    description: 'Ahorro grupal para unas vacaciones familiares increíbles',
    target: 10000,
    current: 6500,
    monthlyContribution: 500,
    deadline: '2025-06-01',
    status: 'active',
    members: [
      { id: 1, name: 'María García', avatar: '', contribution: 1800, status: 'current' },
      { id: 2, name: 'Carlos López', avatar: '', contribution: 1600, status: 'current' },
      { id: 3, name: 'Ana Martínez', avatar: '', contribution: 1750, status: 'late' },
      { id: 4, name: 'Pedro Silva', avatar: '', contribution: 1350, status: 'current' }
    ],
    performance: [
      { month: 'Ene', amount: 2000, target: 1600 },
      { month: 'Feb', amount: 4200, target: 3200 },
      { month: 'Mar', amount: 6500, target: 4800 },
      { month: 'Abr', amount: 6500, target: 6400 },
    ],
    transactions: [
      { id: 1, type: 'contribution', amount: 500, member: 'María García', date: '2024-03-15', status: 'completed' },
      { id: 2, type: 'contribution', amount: 400, member: 'Carlos López', date: '2024-03-14', status: 'completed' },
      { id: 3, type: 'investment', amount: 2000, description: 'Fondo de inversión ETF', date: '2024-03-10', status: 'pending_vote' },
    ],
    activeVoting: {
      id: 1,
      title: 'Inversión en ETF Tecnológico',
      description: 'Propuesta para invertir $2,000 en un ETF de empresas tecnológicas',
      amount: 2000,
      votesFor: 2,
      votesAgainst: 0,
      totalMembers: 4,
      deadline: '2024-03-20',
      details: 'Este ETF ha mostrado un rendimiento del 12% anual en los últimos 3 años'
    }
  };

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59 };
        }
        return prev;
      });
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleVote = (vote: 'for' | 'against') => {
    alert(`Has votado ${vote === 'for' ? 'a favor' : 'en contra'} de la propuesta`);
    setShowVotingModal(false);
  };

  const handlePayment = () => {
    alert('Redirigiendo a PayPal para realizar el pago...');
  };

  const downloadReport = (format: string) => {
    alert(`Descargando reporte en formato ${format.toUpperCase()}...`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl mb-2">{groupData.name}</h1>
          <p className="text-muted-foreground">{groupData.description}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => downloadReport('pdf')}>
            <Download className="mr-2 h-4 w-4" />
            Reporte PDF
          </Button>
          <Button onClick={handlePayment}>
            <CreditCard className="mr-2 h-4 w-4" />
            Realizar Pago
          </Button>
        </div>
      </div>

      {/* Active Voting Alert */}
      {groupData.activeVoting && (
        <Alert className="border-orange-200 bg-orange-50">
          <Vote className="h-4 w-4" />
          <AlertDescription>
            <div className="flex justify-between items-center">
              <div>
                <strong>Votación Activa:</strong> {groupData.activeVoting.title}
                <br />
                <span className="text-sm">
                  Votos: {groupData.activeVoting.votesFor} a favor, {groupData.activeVoting.votesAgainst} en contra
                </span>
              </div>
              <Button onClick={() => setShowVotingModal(true)}>
                Votar Ahora
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Progreso Actual</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">${groupData.current.toLocaleString()}</div>
            <div className="mt-2">
              <Progress value={(groupData.current / groupData.target) * 100} />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round((groupData.current / groupData.target) * 100)}% de la meta
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Meta del Grupo</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">${groupData.target.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Faltan ${(groupData.target - groupData.current).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Miembros</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{groupData.members.length}</div>
            <p className="text-xs text-muted-foreground">
              1 con retraso en pago
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Tiempo Restante</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg">
              {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
            </div>
            <p className="text-xs text-muted-foreground">
              Hasta la fecha límite
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="members">Miembros</TabsTrigger>
          <TabsTrigger value="transactions">Transacciones</TabsTrigger>
          <TabsTrigger value="voting">Votaciones</TabsTrigger>
          <TabsTrigger value="ai">Asistente IA</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Rendimiento del Grupo</CardTitle>
                <CardDescription>
                  Progreso vs meta mensual
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={groupData.performance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Bar dataKey="amount" fill="hsl(var(--primary))" name="Actual" />
                    <Bar dataKey="target" fill="hsl(var(--muted))" name="Meta" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contribuciones por Miembro</CardTitle>
                <CardDescription>
                  Estado de aportes individuales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {groupData.members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">
                            ${member.contribution.toLocaleString()} contribuido
                          </p>
                        </div>
                      </div>
                      <Badge variant={member.status === 'late' ? 'destructive' : 'default'}>
                        {member.status === 'late' ? (
                          <>
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Atrasado
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Al día
                          </>
                        )}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Miembros</CardTitle>
              <CardDescription>
                Administra los miembros del grupo y sus contribuciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {groupData.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Contribución total: ${member.contribution.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Porcentaje: {Math.round((member.contribution / groupData.current) * 100)}%
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={member.status === 'late' ? 'destructive' : 'default'}>
                        {member.status === 'late' ? 'Atrasado' : 'Al día'}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Contactar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Transacciones</CardTitle>
              <CardDescription>
                Todas las transacciones del grupo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {groupData.transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">
                        {transaction.type === 'contribution' ? 'Contribución' : 'Inversión'}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {transaction.member || transaction.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${transaction.amount.toLocaleString()}</p>
                      <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                        {transaction.status === 'completed' ? 'Completado' : 'Pendiente'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voting" className="space-y-6">
          {groupData.activeVoting && (
            <Card>
              <CardHeader>
                <CardTitle>Votación Activa</CardTitle>
                <CardDescription>
                  Decide sobre la siguiente propuesta de inversión
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{groupData.activeVoting.title}</h3>
                    <p className="text-muted-foreground">{groupData.activeVoting.description}</p>
                    <p className="text-sm mt-2">
                      <strong>Monto:</strong> ${groupData.activeVoting.amount.toLocaleString()}
                    </p>
                    <p className="text-sm">
                      <strong>Detalles:</strong> {groupData.activeVoting.details}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Resultados actuales:</p>
                      <p className="text-sm text-muted-foreground">
                        {groupData.activeVoting.votesFor} a favor, {groupData.activeVoting.votesAgainst} en contra
                      </p>
                      <Progress 
                        value={(groupData.activeVoting.votesFor / groupData.activeVoting.totalMembers) * 100} 
                        className="mt-2"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={() => handleVote('against')} variant="outline">
                        Votar en Contra
                      </Button>
                      <Button onClick={() => handleVote('for')}>
                        Votar a Favor
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="w-5 h-5 mr-2 text-primary" />
                Asistente IA del Grupo
              </CardTitle>
              <CardDescription>
                Recomendaciones y análisis personalizados para tu grupo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Bot className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Análisis de Rendimiento</p>
                      <p className="text-sm text-blue-700">
                        Tu grupo está 8% por encima de la meta mensual. Excelente trabajo manteniendo la disciplina de ahorro.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Bot className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-900">Recomendación de Inversión</p>
                      <p className="text-sm text-yellow-700">
                        Considera diversificar el 30% de tus ahorros en bonos gubernamentales para reducir el riesgo.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Bot className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-900">Motivación</p>
                      <p className="text-sm text-green-700">
                        ¡Increíble! A este ritmo alcanzarán su meta 2 meses antes de lo planeado. Mantengan el momentum.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Bot className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-900">Alerta</p>
                      <p className="text-sm text-red-700">
                        Ana Martínez tiene un retraso en su pago. Considera enviarle un recordatorio amistoso.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}