import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  BookOpen, 
  Video, 
  FileText, 
  Download, 
  ExternalLink, 
  Search,
  Clock,
  Star,
  Users,
  TrendingUp,
  Shield,
  Calculator,
  Target,
  Bot
} from 'lucide-react';

export function Resources() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for resources
  const appGuides = [
    {
      id: 1,
      title: 'Cómo Crear tu Primer Grupo de Inversión',
      description: 'Guía paso a paso para crear y configurar tu primer grupo de ahorro',
      type: 'video',
      duration: '8 min',
      difficulty: 'Básico',
      category: 'Primeros Pasos'
    },
    {
      id: 2,
      title: 'Gestión de Votaciones Grupales',
      description: 'Aprende a crear y participar en votaciones para decisiones de inversión',
      type: 'guide',
      duration: '5 min',
      difficulty: 'Intermedio',
      category: 'Funcionalidades'
    },
    {
      id: 3,
      title: 'Configuración de Notificaciones',
      description: 'Personaliza tus alertas y recordatorios para no perder ningún pago',
      type: 'guide',
      duration: '3 min',
      difficulty: 'Básico',
      category: 'Configuración'
    },
    {
      id: 4,
      title: 'Interpretando tus Dashboards',
      description: 'Entiende todas las métricas y gráficos de tu panel personal y grupal',
      type: 'video',
      duration: '12 min',
      difficulty: 'Intermedio',
      category: 'Análisis'
    },
    {
      id: 5,
      title: 'Seguridad y Verificación KYC',
      description: 'Todo sobre la seguridad de la plataforma y el proceso de verificación',
      type: 'guide',
      duration: '7 min',
      difficulty: 'Básico',
      category: 'Seguridad'
    }
  ];

  const financialEducation = [
    {
      id: 1,
      title: 'Fundamentos de Inversión Grupal',
      description: 'Conceptos básicos sobre inversión colaborativa y sus beneficios',
      type: 'article',
      duration: '15 min',
      difficulty: 'Básico',
      rating: 4.8,
      category: 'Inversión'
    },
    {
      id: 2,
      title: 'Diversificación de Portfolio',
      description: 'Estrategias para distribuir riesgo en tus inversiones',
      type: 'video',
      duration: '20 min',
      difficulty: 'Intermedio',
      rating: 4.9,
      category: 'Estrategia'
    },
    {
      id: 3,
      title: 'Análisis de Riesgo vs Retorno',
      description: 'Cómo evaluar oportunidades de inversión y gestionar el riesgo',
      type: 'pdf',
      duration: '25 min',
      difficulty: 'Avanzado',
      rating: 4.7,
      category: 'Análisis'
    },
    {
      id: 4,
      title: 'Planificación Financiera Personal',
      description: 'Establecer metas financieras realistas y alcanzables',
      type: 'article',
      duration: '12 min',
      difficulty: 'Básico',
      rating: 4.6,
      category: 'Planificación'
    },
    {
      id: 5,
      title: 'ETFs vs Fondos Mutuos',
      description: 'Comparación detallada de diferentes vehículos de inversión',
      type: 'video',
      duration: '18 min',
      difficulty: 'Intermedio',
      rating: 4.8,
      category: 'Productos'
    }
  ];

  const externalResources = [
    {
      id: 1,
      title: 'Morningstar - Análisis de Fondos',
      description: 'Plataforma líder para investigación y análisis de inversiones',
      url: 'https://morningstar.com',
      category: 'Investigación',
      type: 'external'
    },
    {
      id: 2,
      title: 'Yahoo Finance',
      description: 'Noticias financieras y cotizaciones en tiempo real',
      url: 'https://finance.yahoo.com',
      category: 'Noticias',
      type: 'external'
    },
    {
      id: 3,
      title: 'Calculadora de Interés Compuesto',
      description: 'Herramienta para calcular el crecimiento de tus inversiones',
      url: 'https://calculator.net/compound-interest-calculator.html',
      category: 'Herramientas',
      type: 'external'
    },
    {
      id: 4,
      title: 'SEC Investor.gov',
      description: 'Recursos educativos oficiales sobre inversión y fraudes',
      url: 'https://investor.gov',
      category: 'Educación',
      type: 'external'
    }
  ];

  const tools = [
    {
      id: 1,
      title: 'Calculadora de Metas de Ahorro',
      description: 'Calcula cuánto necesitas ahorrar mensualmente para alcanzar tu meta',
      icon: Calculator,
      action: 'calculator'
    },
    {
      id: 2,
      title: 'Evaluador de Perfil de Riesgo',
      description: 'Descubre tu tolerancia al riesgo con nuestro cuestionario',
      icon: Target,
      action: 'risk_assessment'
    },
    {
      id: 3,
      title: 'Simulador de Rendimientos',
      description: 'Proyecta el crecimiento de tus inversiones grupales',
      icon: TrendingUp,
      action: 'simulator'
    },
    {
      id: 4,
      title: 'Asistente IA Financiero',
      description: 'Obtén consejos personalizados para tus finanzas',
      icon: Bot,
      action: 'ai_assistant'
    }
  ];

  const filteredAppGuides = appGuides.filter(guide =>
    guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFinancialEducation = financialEducation.filter(resource =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIconForType = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'guide': return BookOpen;
      case 'article': return FileText;
      case 'pdf': return FileText;
      default: return BookOpen;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Básico': return 'default';
      case 'Intermedio': return 'secondary';
      case 'Avanzado': return 'destructive';
      default: return 'default';
    }
  };

  const handleToolAction = (action: string) => {
    switch (action) {
      case 'calculator':
        alert('Abriendo calculadora de metas de ahorro...');
        break;
      case 'risk_assessment':
        alert('Iniciando evaluación de perfil de riesgo...');
        break;
      case 'simulator':
        alert('Cargando simulador de rendimientos...');
        break;
      case 'ai_assistant':
        alert('Conectando con el asistente IA...');
        break;
      default:
        break;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl mb-4">Centro de Recursos</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Encuentra guías, tutoriales y recursos educativos para maximizar tu experiencia con SaveInvest
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar recursos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="app_guides" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="app_guides">Guías de la App</TabsTrigger>
          <TabsTrigger value="financial_education">Educación Financiera</TabsTrigger>
          <TabsTrigger value="tools">Herramientas</TabsTrigger>
          <TabsTrigger value="external">Recursos Externos</TabsTrigger>
        </TabsList>

        <TabsContent value="app_guides" className="space-y-6">
          <div>
            <h2 className="text-2xl mb-4">Guías de Uso de la Aplicación</h2>
            <p className="text-muted-foreground mb-6">
              Aprende a usar todas las funcionalidades de SaveInvest
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {filteredAppGuides.map((guide) => {
              const IconComponent = getIconForType(guide.type);
              return (
                <Card key={guide.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{guide.title}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={getDifficultyColor(guide.difficulty)}>
                              {guide.difficulty}
                            </Badge>
                            <span className="text-sm text-muted-foreground flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {guide.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      {guide.description}
                    </CardDescription>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">{guide.category}</Badge>
                      <div className="flex space-x-2">
                        <Button size="sm">
                          {guide.type === 'video' ? 'Ver Video' : 'Leer Guía'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="financial_education" className="space-y-6">
          <div>
            <h2 className="text-2xl mb-4">Educación Financiera</h2>
            <p className="text-muted-foreground mb-6">
              Contenido educativo para mejorar tus conocimientos financieros
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {filteredFinancialEducation.map((resource) => {
              const IconComponent = getIconForType(resource.type);
              return (
                <Card key={resource.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{resource.title}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={getDifficultyColor(resource.difficulty)}>
                              {resource.difficulty}
                            </Badge>
                            <span className="text-sm text-muted-foreground flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {resource.duration}
                            </span>
                            <div className="flex items-center">
                              <Star className="w-3 h-3 text-yellow-500 mr-1" />
                              <span className="text-sm">{resource.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      {resource.description}
                    </CardDescription>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">{resource.category}</Badge>
                      <div className="flex space-x-2">
                        <Button size="sm">
                          {resource.type === 'video' ? 'Ver Video' : 
                           resource.type === 'pdf' ? 'Descargar PDF' : 'Leer Artículo'}
                        </Button>
                        {resource.type === 'pdf' && (
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          <div>
            <h2 className="text-2xl mb-4">Herramientas Financieras</h2>
            <p className="text-muted-foreground mb-6">
              Calculadoras y herramientas para planificar tus inversiones
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {tools.map((tool) => (
              <Card key={tool.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <tool.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{tool.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {tool.description}
                  </CardDescription>
                  <Button 
                    className="w-full"
                    onClick={() => handleToolAction(tool.action)}
                  >
                    Usar Herramienta
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="external" className="space-y-6">
          <div>
            <h2 className="text-2xl mb-4">Recursos Externos</h2>
            <p className="text-muted-foreground mb-6">
              Enlaces a plataformas y herramientas financieras recomendadas
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {externalResources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <ExternalLink className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{resource.title}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {resource.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {resource.description}
                  </CardDescription>
                  <Button 
                    className="w-full"
                    onClick={() => window.open(resource.url, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visitar Sitio
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}