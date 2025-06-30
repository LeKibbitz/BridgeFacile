import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { 
  BookOpen, 
  Users, 
  Trophy, 
  Star, 
  Play, 
  ChevronRight, 
  Mail, 
  Phone,
  Clock,
  Target,
  Award,
  Heart,
  Diamond,
  Spade,
  Club,
  X,
  MessageCircle,
  Video,
  Calendar,
  CheckCircle,
  BarChart3
} from 'lucide-react'
import './App.css'

// Contact Modal Component
function ContactModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    pseudo: '',
    email: '',
    postal_code: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // Configuration Supabase
      const SUPABASE_URL = 'https://wfctinichbyfuwmxkebl.supabase.co'
      const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmY3RpbmljaGJ5ZnV3bXhrZWJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMzA4MTYsImV4cCI6MjA2NjgwNjgxNn0.dol16RsNz7_hjgEhVlSM0l0p7U6sW3GYGueBx9AFOLw'

      // Envoi vers Supabase
      const response = await fetch(`${SUPABASE_URL}/rest/v1/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          pseudo: formData.pseudo,
          email: formData.email,
          postal_code: formData.postal_code,
          message: formData.message
        })
      })

      if (response.ok) {
        setSubmitStatus({ 
          type: 'success', 
          message: 'Votre message a été envoyé avec succès ! Nous vous recontacterons bientôt.' 
        })
        setFormData({ first_name: '', last_name: '', pseudo: '', email: '', postal_code: '', message: '' })
        setTimeout(() => {
          onClose()
          setSubmitStatus(null)
        }, 3000)
      } else {
        const errorData = await response.text()
        console.error('Erreur Supabase:', errorData)
        setSubmitStatus({ 
          type: 'error', 
          message: 'Erreur lors de l\'envoi. Veuillez réessayer ou nous contacter directement.' 
        })
      }
    } catch (error) {
      console.error('Erreur de connexion:', error)
      setSubmitStatus({ 
        type: 'error', 
        message: 'Erreur de connexion. Veuillez vérifier votre connexion internet et réessayer.' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-800">Contactez-nous</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                Prénom
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Votre prénom..."
              />
            </div>

            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Votre nom de famille..."
              />
            </div>

            <div>
              <label htmlFor="pseudo" className="block text-sm font-medium text-gray-700 mb-1">
                Votre pseudo le plus chanceux
              </label>
              <input
                type="text"
                id="pseudo"
                name="pseudo"
                value={formData.pseudo}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Votre pseudo favori..."
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Meilleure Adresse mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="votre.email@exemple.com"
              />
            </div>

            <div>
              <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-1">
                Code postal
              </label>
              <input
                type="text"
                id="postal_code"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="75001"
              />
              <p className="text-xs text-gray-500 mt-1">
                Nous utilisons votre code postal pour vous trouver le club de bridge le plus proche de chez vous
              </p>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Partagez vos questions, remarques ou demandes..."
              />
            </div>

            {submitStatus && (
              <div className={`p-3 rounded-md ${
                submitStatus.type === 'success' 
                  ? 'bg-green-100 text-green-700 border border-green-300' 
                  : 'bg-red-100 text-red-700 border border-red-300'
              }`}>
                {submitStatus.message}
              </div>
            )}

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Envoyer le message
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-3">Moyens de Contact</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <Mail className="w-4 h-4 text-green-600 mr-2" />
                <span>thomas.joannes@bridgefacile.fr</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 text-green-600 mr-2" />
                <span>+33 6 58 51 58 34</span>
              </div>
              <div className="flex items-center">
                <MessageCircle className="w-4 h-4 text-green-600 mr-2" />
                <span>WhatsApp / SMS disponibles</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Progress Bar Component
function ProgressBar({ progress, total }) {
  const percentage = (progress / total) * 100
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
      <div 
        className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
        style={{ width: `${percentage}%` }}
      ></div>
      <div className="flex justify-between text-sm text-gray-600 mt-1">
        <span>Progression</span>
        <span>{progress}/{total} modules ({Math.round(percentage)}%)</span>
      </div>
    </div>
  )
}

// Trustpilot Review Component
function TrustpilotReview({ moduleTitle, onReviewComplete }) {
  const [showReview, setShowReview] = useState(false)
  
  const handleReviewClick = () => {
    // Ouvrir Trustpilot dans un nouvel onglet
    window.open('https://fr.trustpilot.com/review/bridgefacile.fr', '_blank')
    setShowReview(false)
    onReviewComplete()
  }

  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Star className="w-5 h-5 text-yellow-500 mr-2" />
          <span className="font-medium text-blue-800">
            Module "{moduleTitle}" terminé !
          </span>
        </div>
        <Button
          onClick={handleReviewClick}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700"
        >
          Évaluer sur Trustpilot
        </Button>
      </div>
      <p className="text-sm text-blue-600 mt-2">
        Votre avis nous aide à améliorer nos cours. Merci !
      </p>
    </div>
  )
}

function App() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [completedModules, setCompletedModules] = useState(0)
  const [showTrustpilot, setShowTrustpilot] = useState(false)

  const slides = [
    {
      id: 'introduction',
      title: 'Introduction au Bridge',
      description: 'Découvrez le monde fascinant du Bridge'
    },
    {
      id: 'basic_setup',
      title: 'Configuration de Base',
      description: 'Apprenez les bases du jeu'
    },
    {
      id: 'hand_evaluation',
      title: 'Évaluation de la Main',
      description: 'Comment évaluer vos cartes'
    },
    {
      id: 'bidding_basics',
      title: 'Les Enchères',
      description: 'Maîtrisez les enchères de base'
    },
    {
      id: 'bidding_examples',
      title: 'Exemples d\'Enchères',
      description: 'Exemples pratiques'
    },
    {
      id: 'play_phase',
      title: 'Phase de Jeu',
      description: 'Comment jouer les cartes'
    },
    {
      id: 'basic_strategies',
      title: 'Stratégies de Base',
      description: 'Techniques fondamentales'
    },
    {
      id: 'scoring',
      title: 'Marquer au Bridge',
      description: 'Système de points'
    },
    {
      id: 'etiquette',
      title: 'Étiquette du Bridge',
      description: 'Comportement à la table'
    },
    {
      id: 'next_steps',
      title: 'Prochaines Étapes',
      description: 'Continuez votre apprentissage'
    }
  ]

  const courseFormulas = [
    {
      type: 'live',
      title: 'Cours en Visio Live',
      icon: Video,
      duration: '8-12 semaines',
      price: 'À partir de 120€',
      description: 'Cours collectifs en direct avec interaction temps réel',
      features: [
        'Sessions live à heures fixes',
        'Interaction directe avec le professeur',
        'Questions/réponses en temps réel',
        'Groupe de 4-8 élèves maximum',
        'Support WhatsApp/SMS/Mail',
        'Certificat de fin de formation'
      ],
      schedules: [
        'Lundi 18h-20h',
        'Mercredi 19h-21h', 
        'Samedi 14h-16h'
      ],
      color: 'blue'
    },
    {
      type: 'autonomous',
      title: 'Cours Autonomes',
      icon: BookOpen,
      duration: 'À votre rythme',
      price: 'À partir de 80€',
      description: 'Apprentissage flexible avec suivi personnalisé',
      features: [
        'Accès 24h/24 aux vidéos et supports',
        'Progression à votre rythme',
        'Point mensuel en visio (1h)',
        'Support WhatsApp/SMS/Mail illimité',
        'Exercices interactifs',
        'Barre de progression motivante'
      ],
      schedules: [
        'Accès immédiat',
        'Point mensuel programmable',
        'Support continu'
      ],
      color: 'green'
    }
  ]

  const testimonials = [
    {
      name: 'Marie Dubois',
      text: 'Excellente méthode d\'apprentissage ! J\'ai progressé très rapidement grâce aux explications claires.',
      rating: 5,
      course: 'Cours en Visio Live'
    },
    {
      name: 'Pierre Martin',
      text: 'Thomas est un professeur patient et pédagogue. Je recommande vivement ses cours.',
      rating: 5,
      course: 'Cours Autonomes'
    },
    {
      name: 'Sophie Laurent',
      text: 'Grâce à ces cours, je participe maintenant à des tournois. Merci pour cette passion partagée !',
      rating: 5,
      course: 'Cours en Visio Live'
    }
  ]

  const handleSlideComplete = (slideIndex) => {
    if (slideIndex > completedModules) {
      setCompletedModules(slideIndex + 1)
      setShowTrustpilot(true)
    }
  }

  const handleTrustpilotComplete = () => {
    setShowTrustpilot(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <Spade className="w-6 h-6 text-black" />
                <Heart className="w-6 h-6 text-red-500" />
                <Diamond className="w-6 h-6 text-red-500" />
                <Club className="w-6 h-6 text-black" />
              </div>
              <h1 className="text-2xl font-bold text-green-800">BridgeFacile</h1>
              <span className="text-sm text-gray-600">@bridgefacile.fr</span>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#accueil" className="text-gray-700 hover:text-green-600 transition-colors">Accueil</a>
              <a href="#cours" className="text-gray-700 hover:text-green-600 transition-colors">Cours</a>
              <a href="#presentation" className="text-gray-700 hover:text-green-600 transition-colors">Présentation</a>
            </nav>
            <Button 
              onClick={() => setIsContactModalOpen(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact
            </Button>
          </div>
        </div>
      </header>

      {/* Contact Modal */}
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />

      {/* Hero Section */}
      <section id="accueil" className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-gray-800 mb-6">
              Apprenez le Bridge avec
              <span className="text-green-600 block">BridgeFacile</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Découvrez le jeu de cartes le plus intellectuel au monde avec nos cours progressifs 
              et notre présentation interactive. Choisissez entre nos cours en visio live ou 
              notre formule autonome avec suivi personnalisé.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                <Play className="w-5 h-5 mr-2" />
                Commencer la Présentation
              </Button>
              <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                <BookOpen className="w-5 h-5 mr-2" />
                Voir les Formules
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-800 mb-6">
                Pourquoi Apprendre le Bridge ?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Target className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Développement Intellectuel</h4>
                    <p className="text-gray-600">Stimulez votre mémoire, logique et capacité d'analyse.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Socialisation</h4>
                    <p className="text-gray-600">Rencontrez des passionnés et créez des liens durables.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Trophy className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Compétition</h4>
                    <p className="text-gray-600">Participez à des tournois locaux et nationaux.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Award className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Plaisir de Jouer</h4>
                    <p className="text-gray-600">Découvrez un jeu riche en stratégies et en émotions.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-emerald-200 p-8 rounded-2xl">
              <h4 className="text-2xl font-bold text-gray-800 mb-4">Thomas Joannès</h4>
              <p className="text-gray-700 mb-4">
                Professeur de bridge passionné avec plus de 15 ans d'expérience dans l'enseignement. 
                Diplômé de la Fédération Française de Bridge, je vous accompagne dans votre découverte 
                de ce jeu fascinant.
              </p>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="secondary">Enseignant FFB</Badge>
                <Badge variant="secondary">15+ ans d'expérience</Badge>
                <Badge variant="secondary">Compétiteur</Badge>
                <Badge variant="secondary">Arbitre fédéral</Badge>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Compétiteur, Arbitre fédéral
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Course Formulas Section */}
      <section id="cours" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Nos Formules de Cours</h3>
            <p className="text-xl text-gray-600">Choisissez la formule qui vous correspond</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {courseFormulas.map((formula, index) => {
              const IconComponent = formula.icon
              return (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                      formula.color === 'blue' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      <IconComponent className={`w-8 h-8 ${
                        formula.color === 'blue' ? 'text-blue-600' : 'text-green-600'
                      }`} />
                    </div>
                    <CardTitle className="text-2xl mb-2">{formula.title}</CardTitle>
                    <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {formula.duration}
                      </div>
                      <span className={`text-2xl font-bold ${
                        formula.color === 'blue' ? 'text-blue-600' : 'text-green-600'
                      }`}>
                        {formula.price}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-6 text-center">{formula.description}</p>
                    
                    <div className="space-y-3 mb-6">
                      <h5 className="font-semibold text-gray-800">Inclus dans cette formule :</h5>
                      <ul className="space-y-2">
                        {formula.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start text-sm">
                            <CheckCircle className={`w-4 h-4 mr-2 mt-0.5 ${
                              formula.color === 'blue' ? 'text-blue-600' : 'text-green-600'
                            }`} />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-6">
                      <h5 className="font-semibold text-gray-800 mb-2">
                        {formula.type === 'live' ? 'Créneaux disponibles :' : 'Modalités :'}
                      </h5>
                      <ul className="space-y-1 text-sm text-gray-600">
                        {formula.schedules.map((schedule, idx) => (
                          <li key={idx} className="flex items-center">
                            <Calendar className="w-3 h-3 mr-2" />
                            {schedule}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button 
                      className={`w-full ${
                        formula.color === 'blue' 
                          ? 'bg-blue-600 hover:bg-blue-700' 
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                      onClick={() => setIsContactModalOpen(true)}
                    >
                      Choisir cette formule
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">
              <strong>Support disponible pour toutes les formules :</strong>
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <div className="flex items-center">
                <Mail className="w-4 h-4 text-green-600 mr-2" />
                <span>Email</span>
              </div>
              <div className="flex items-center">
                <MessageCircle className="w-4 h-4 text-green-600 mr-2" />
                <span>WhatsApp</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 text-green-600 mr-2" />
                <span>SMS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Presentation Section */}
      <section id="presentation" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Présentation Interactive</h3>
            <p className="text-xl text-gray-600">Découvrez le bridge étape par étape</p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
              <ProgressBar progress={completedModules} total={slides.length} />
            </div>

            <Tabs value={slides[activeSlide].id} className="w-full">
              <TabsList className="grid grid-cols-5 lg:grid-cols-10 mb-8">
                {slides.map((slide, index) => (
                  <TabsTrigger 
                    key={slide.id} 
                    value={slide.id}
                    onClick={() => setActiveSlide(index)}
                    className={`text-xs p-2 ${
                      index < completedModules ? 'bg-green-100 text-green-800' : ''
                    }`}
                  >
                    {index < completedModules && <CheckCircle className="w-3 h-3 mr-1" />}
                    {index + 1}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {slides.map((slide, index) => (
                <TabsContent key={slide.id} value={slide.id}>
                  <Card className="min-h-[500px]">
                    <CardHeader>
                      <CardTitle className="text-2xl text-center">{slide.title}</CardTitle>
                      <CardDescription className="text-center">{slide.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gradient-to-br from-green-800 to-emerald-900 rounded-lg p-8 text-white min-h-[400px] flex items-center justify-center">
                        <div className="text-center">
                          <div className="mb-6">
                            <div className="flex justify-center space-x-2 mb-4">
                              <Spade className="w-8 h-8" />
                              <Heart className="w-8 h-8 text-red-400" />
                              <Diamond className="w-8 h-8 text-red-400" />
                              <Club className="w-8 h-8" />
                            </div>
                          </div>
                          <h4 className="text-3xl font-bold mb-4">{slide.title}</h4>
                          <p className="text-xl text-green-200 mb-6">{slide.description}</p>
                          <p className="text-lg">
                            Contenu de la diapositive {index + 1} - {slide.title}
                          </p>
                          
                          {index >= completedModules && (
                            <Button 
                              onClick={() => handleSlideComplete(index)}
                              className="mt-6 bg-white text-green-800 hover:bg-gray-100"
                            >
                              Marquer comme terminé
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between mt-6">
                        <Button 
                          variant="outline" 
                          onClick={() => setActiveSlide(Math.max(0, activeSlide - 1))}
                          disabled={activeSlide === 0}
                        >
                          Précédent
                        </Button>
                        <span className="flex items-center text-sm text-gray-600">
                          {activeSlide + 1} / {slides.length}
                        </span>
                        <Button 
                          onClick={() => setActiveSlide(Math.min(slides.length - 1, activeSlide + 1))}
                          disabled={activeSlide === slides.length - 1}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Suivant
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Trustpilot Review */}
                  {showTrustpilot && index === completedModules - 1 && (
                    <TrustpilotReview 
                      moduleTitle={slide.title}
                      onReviewComplete={handleTrustpilotComplete}
                    />
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Témoignages</h3>
            <p className="text-xl text-gray-600">Ce que disent nos élèves</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold text-gray-800">- {testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.course}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex space-x-1">
                  <Spade className="w-5 h-5" />
                  <Heart className="w-5 h-5 text-red-400" />
                  <Diamond className="w-5 h-5 text-red-400" />
                  <Club className="w-5 h-5" />
                </div>
                <h4 className="text-xl font-bold">BridgeFacile</h4>
              </div>
              <p className="text-gray-300">
                Votre partenaire pour apprendre le bridge de manière progressive et ludique.
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Contact</h5>
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>thomas.joannes@bridgefacile.fr</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>+33 6 58 51 58 34</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  <span>WhatsApp / SMS disponibles</span>
                </div>
              </div>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Horaires</h5>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>Lundi - Mercredi:</span>
                  <span>18h00 - 21h00</span>
                </div>
                <div className="flex justify-between">
                  <span>Samedi:</span>
                  <span>14h00 - 18h00</span>
                </div>
                <div className="flex justify-between">
                  <span>Dimanche:</span>
                  <span>10h00 - 12h00</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 BridgeFacile. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

