import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Mail } from 'lucide-react';

export default function UMontpellierForm() {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    position: '',
    commentaire: ''
  });

  useEffect(() => {
    const submitted = sessionStorage.getItem('formSubmitted');
    const submittedEmail = sessionStorage.getItem('submittedEmail');
    if (submitted && submittedEmail) {
      setEmail(submittedEmail);
      setStep('blocked');
    }
  }, []);

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@etu\.umontpellier\.fr$/;
    return regex.test(email);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Veuillez utiliser une adresse email valide @etu.umontpellier.fr');
      return;
    }

    const usedEmails = JSON.parse(sessionStorage.getItem('usedEmails') || '[]');
    if (usedEmails.includes(email)) {
      setError('Cette adresse email a déjà été utilisée pour répondre au formulaire.');
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    
    console.log(`Code de vérification pour ${email}: ${code}`);
    alert(`Code de vérification (simulé): ${code}\n\nDans un système réel, ce code serait envoyé à votre adresse email.`);
    
    setStep('verify');
  };

  const handleVerification = (e) => {
    e.preventDefault();
    setError('');

    if (verificationCode !== generatedCode) {
      setError('Code de vérification incorrect.');
      return;
    }

    setStep('form');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.position) {
      setError('Veuillez sélectionner votre position.');
      return;
    }

    const usedEmails = JSON.parse(sessionStorage.getItem('usedEmails') || '[]');
    usedEmails.push(email);
    sessionStorage.setItem('usedEmails', JSON.stringify(usedEmails));
    sessionStorage.setItem('formSubmitted', 'true');
    sessionStorage.setItem('submittedEmail', email);

    console.log('Formulaire soumis:', { email, ...formData });

    setStep('submitted');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Vote : Blocage de Vendredi
          </h1>
          <p className="text-sm text-gray-600">
            Université de Montpellier - Étudiants uniquement
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {step === 'email' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email universitaire *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="prenom.nom@etu.umontpellier.fr"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Seules les adresses @etu.umontpellier.fr sont acceptées
              </p>
            </div>
            <button
              onClick={handleEmailSubmit}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Continuer
            </button>
          </div>
        )}

        {step === 'verify' && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-blue-800">
                Un code de vérification a été envoyé à <strong>{email}</strong>
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code de vérification *
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleVerification(e);
                }}
                placeholder="123456"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
                maxLength={6}
                required
              />
            </div>
            <button
              onClick={handleVerification}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Vérifier
            </button>
            <button
              onClick={() => setStep('email')}
              className="w-full text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors text-sm"
            >
              Modifier l'email
            </button>
          </div>
        )}

        {step === 'form' && (
          <div className="space-y-4">
            <div className="bg-green-50 p-3 rounded-lg mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-sm text-green-800">Email vérifié: {email}</p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">
                Question :
              </h3>
              <p className="text-blue-800">
                Êtes-vous pour ou contre le blocage de l'université vendredi prochain ?
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Votre position *
              </label>
              <div className="space-y-2">
                <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="position"
                    value="pour"
                    checked={formData.position === 'pour'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-3 text-gray-700 font-medium">✅ Pour le blocage</span>
                </label>
                
                <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="position"
                    value="contre"
                    checked={formData.position === 'contre'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-red-600 focus:ring-red-500"
                  />
                  <span className="ml-3 text-gray-700 font-medium">❌ Contre le blocage</span>
                </label>
                
                <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="position"
                    value="neutre"
                    checked={formData.position === 'neutre'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-gray-600 focus:ring-gray-500"
                  />
                  <span className="ml-3 text-gray-700 font-medium">⚪ Pas d'avis / Ne se prononce pas</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commentaire (optionnel)
              </label>
              <textarea
                name="commentaire"
                value={formData.commentaire}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Exprimez votre opinion, vos raisons..."
              />
            </div>

            <button
              onClick={handleFormSubmit}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
            >
              Soumettre mon vote
            </button>
          </div>
        )}

        {step === 'submitted' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Vote enregistré !
            </h2>
            <p className="text-gray-600 mb-4">
              Merci d'avoir participé au vote.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg text-left">
              <p className="text-sm text-gray-600 mb-1">Email: {email}</p>
              <p className="text-sm font-semibold text-gray-800">
                Position: {
                  formData.position === 'pour' ? '✅ Pour le blocage' :
                  formData.position === 'contre' ? '❌ Contre le blocage' :
                  '⚪ Pas d\'avis'
                }
              </p>
            </div>
          </div>
        )}

        {step === 'blocked' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-orange-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Vote déjà enregistré
            </h2>
            <p className="text-gray-600 mb-4">
              Vous avez déjà voté avec l'adresse {email}.
            </p>
            <p className="text-sm text-gray-500">
              Un seul vote par personne est autorisé.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
