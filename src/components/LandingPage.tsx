import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Users, TrendingUp, Shield, Target, Bot, DollarSign } from 'lucide-react';

export function LandingPage() {
  const features = [
    {
      icon: Users,
      title: 'Ahorro Grupal',
      description: 'Crea grupos con amigos y familiares para alcanzar metas financieras juntos'
    },
    {
      icon: TrendingUp,
      title: 'Inversiones Inteligentes',
      description: 'Recibe recomendaciones personalizadas basadas en IA para optimizar tus inversiones'
    },
    {
      icon: Shield,
      title: 'Seguridad Avanzada',
      description: 'Autenticación 2FA y encriptación de datos para proteger tus finanzas'
    },
    {
      icon: Target,
      title: 'Metas Claras',
      description: 'Define objetivos específicos y sigue tu progreso en tiempo real'
    },
    {
      icon: Bot,
      title: 'Asistente IA',
      description: 'Consejos personalizados y motivación constante para mantener tus hábitos'
    },
    {
      icon: DollarSign,
      title: 'Gestión de Pagos',
      description: 'Integración con PayPal para facilitar aportes y transferencias'
    }
  ];

  return (
    <div className="flex flex-col relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Left side plants */}
        <div className="absolute left-10 bottom-20 opacity-8">
          <svg width="150" height="200" viewBox="0 0 150 200" className="text-secondary">
            {/* Small growing plants */}
            <path d="M20 180 Q25 160 30 140 Q35 120 40 100" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.4"/>
            <circle cx="40" cy="100" r="8" fill="currentColor" opacity="0.5"/>
            <circle cx="35" cy="110" r="6" fill="currentColor" opacity="0.4"/>
            <circle cx="45" cy="115" r="5" fill="currentColor" opacity="0.4"/>
            
            <path d="M60 180 Q70 150 80 120 Q85 100 90 80" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.4"/>
            <circle cx="90" cy="80" r="12" fill="currentColor" opacity="0.5"/>
            <circle cx="82" cy="90" r="8" fill="currentColor" opacity="0.4"/>
            <circle cx="98" cy="95" r="7" fill="currentColor" opacity="0.4"/>
            
            <path d="M110 180 Q115 160 120 140" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3"/>
            <circle cx="120" cy="140" r="5" fill="currentColor" opacity="0.4"/>
          </svg>
        </div>

        {/* Right side plants */}
        <div className="absolute right-5 bottom-32 opacity-8">
          <svg width="120" height="180" viewBox="0 0 120 180" className="text-accent">
            {/* Growing vines */}
            <path d="M10 170 Q20 150 15 130 Q10 110 20 90 Q30 70 25 50" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.4"/>
            <circle cx="25" cy="50" r="4" fill="currentColor" opacity="0.5"/>
            <circle cx="20" cy="90" r="3" fill="currentColor" opacity="0.4"/>
            <circle cx="15" cy="130" r="3" fill="currentColor" opacity="0.4"/>
            
            <path d="M50 170 Q60 140 70 110 Q75 90 80 70" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.4"/>
            <circle cx="80" cy="70" r="6" fill="currentColor" opacity="0.5"/>
            <circle cx="70" cy="110" r="4" fill="currentColor" opacity="0.4"/>
            
            <path d="M90 170 Q95 150 100 130 Q105 110 110 90" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3"/>
            <circle cx="110" cy="90" r="3" fill="currentColor" opacity="0.4"/>
          </svg>
        </div>

        {/* Top decorative elements */}
        <div className="absolute left-1/4 top-10 opacity-6">
          <svg width="100" height="100" viewBox="0 0 100 100" className="text-secondary">
            <circle cx="50" cy="50" r="3" fill="currentColor" opacity="0.5" className="animate-ping" style={{animationDuration: '4s'}}/>
            <circle cx="30" cy="30" r="2" fill="currentColor" opacity="0.4" className="animate-ping" style={{animationDuration: '5s', animationDelay: '1s'}}/>
            <circle cx="70" cy="35" r="2" fill="currentColor" opacity="0.4" className="animate-ping" style={{animationDuration: '6s', animationDelay: '2s'}}/>
          </svg>
        </div>

        <div className="absolute right-1/4 top-16 opacity-6">
          <svg width="80" height="80" viewBox="0 0 80 80" className="text-accent">
            <circle cx="40" cy="40" r="2" fill="currentColor" opacity="0.5" className="animate-ping" style={{animationDuration: '5s'}}/>
            <circle cx="20" cy="25" r="1.5" fill="currentColor" opacity="0.4" className="animate-ping" style={{animationDuration: '4s', animationDelay: '1.5s'}}/>
            <circle cx="60" cy="30" r="1.5" fill="currentColor" opacity="0.4" className="animate-ping" style={{animationDuration: '6s', animationDelay: '0.5s'}}/>
          </svg>
        </div>
      </div>

      {/* Main content with higher z-index */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Badge variant="secondary" className="mb-4">
                Plataforma de Inversión Grupal
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl mx-auto relative">
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 via-accent/10 to-secondary/10 blur-2xl -z-10 transform scale-105 opacity-50"></div>
                <span className="relative text-primary">
                  Invierte y Ahorra en 
                </span>
                <span className="relative text-accent font-extrabold"> Grupo</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Une fuerzas con otros inversores, toma decisiones colectivas y alcanza tus metas financieras más rápido con nuestra plataforma impulsada por IA.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/register">Comenzar Gratis</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/login">Iniciar Sesión</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl mb-4">
                ¿Cómo Funciona GroupGrow?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Nuestra plataforma combina la sabiduría colectiva con tecnología avanzada para maximizar tus resultados de inversión
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-muted/30 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl mb-4">
                Proceso Simple en 3 Pasos
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl mb-2">Crea tu Grupo</h3>
                <p className="text-muted-foreground">
                  Invita a amigos o únete a grupos existentes con objetivos similares
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl mb-2">Define Metas</h3>
                <p className="text-muted-foreground">
                  Establece objetivos claros y aportes regulares para alcanzarlos
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl mb-2">Invierte Juntos</h3>
                <p className="text-muted-foreground">
                  Toma decisiones grupales y sigue el progreso en tiempo real
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-primary-foreground py-20">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl mb-4">
              ¿Listo para Transformar tus Finanzas?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Únete a miles de usuarios que ya están construyendo su futuro financiero de manera inteligente y colaborativa
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/register">Crear Cuenta Gratuita</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}