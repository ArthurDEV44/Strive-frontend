import '../styles/Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal = ({ isOpen, onClose }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-gray-900 rounded-xl p-8 w-11/12 md:w-3/4 lg:w-1/2 modal-content shadow-lg shadow-[0_0_20px_8px_rgba(139,92,246,0.2)]">
        <div className="modal-body max-h-[70vh] overflow-y-auto pr-4">
          <h2 className="text-3xl font-bold mb-6 text-white bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
            Règlement Customs Lobby
          </h2>

          <h3 className="text-2xl font-semibold mb-3 text-indigo-400">Customs Lobby</h3>
          <p className="mb-6 text-gray-300"><strong>Départ minimum</strong> : 80 à 120 joueurs</p>

          <h3 className="text-xl font-semibold mb-3 text-indigo-400">Multiplicateur / Points de Classement</h3>
          <ul className="list-disc ml-6 text-gray-300 mb-6">
            <li><strong>1er</strong> : x2 / 20 points</li>
            <li><strong>2e - 5e</strong> : x1,8 / 10 points</li>
            <li><strong>6e - 15e</strong> : x1,5 / 5 points</li>
            <li><strong>16e - 20e</strong> : x1,4</li>
            <li><strong>20e - 30e</strong> : x1,2</li>
            <li><strong>30e - 40e</strong> : x1</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 text-indigo-400">Match Point</h3>
          <p className="mb-6 text-gray-300">
            <strong>120 points</strong> sans bonus de classement<br />
            <strong>150 points</strong> avec bonus de classement
          </p>

          <h3 className="text-xl font-semibold mb-3 text-indigo-400">Répartition des Gains</h3>
          <h4 className="text-lg font-semibold mb-2 text-indigo-300">Tournois (Entrée à 5€ et 7,5€)</h4>
          <ul className="list-disc ml-6 text-gray-300 mb-6">
            <li><strong>Pourcentage de gains</strong> :
              <ul className="ml-4">
                <li>1er : 70%</li>
                <li>2e : 30%</li>
              </ul>
            </li>
            <li><strong>Tournoi entrée à 5€</strong> : 540€ de cash prize
              <ul className="ml-4">
                <li>1er : 540€ x 70% = <strong>378€</strong> (soit <strong>126€</strong> par joueur)</li>
                <li>2e : 540€ x 30% = <strong>162€</strong> (soit <strong>54€</strong> par joueur)</li>
              </ul>
            </li>
            <li><strong>Tournoi entrée à 7,5€</strong> : 780€ de cash prize
              <ul className="ml-4">
                <li>1er : 780€ x 70% = <strong>546€</strong> (soit <strong>182€</strong> par joueur)</li>
                <li>2e : 780€ x 30% = <strong>234€</strong> (soit <strong>78€</strong> par joueur)</li>
              </ul>
            </li>
          </ul>

          <h4 className="text-lg font-semibold mb-2 text-indigo-300">Tournois (Entrée à 10€ et 15€)</h4>
          <ul className="list-disc ml-6 text-gray-300 mb-6">
            <li><strong>Pourcentage de gains</strong> :
              <ul className="ml-4">
                <li>1er : 60%</li>
                <li>2e : 30%</li>
                <li>3e : 10%</li>
              </ul>
            </li>
            <li><strong>Tournoi entrée à 10€</strong> : 960€ de cash prize
              <ul className="ml-4">
                <li>1er : 960€ x 60% = <strong>576€</strong> (soit <strong>192€</strong> par joueur)</li>
                <li>2e : 960€ x 30% = <strong>288€</strong> (soit <strong>96€</strong> par joueur)</li>
                <li>3e : 960€ x 10% = <strong>96€</strong> (soit <strong>32€</strong> par joueur)</li>
              </ul>
            </li>
            <li><strong>Tournoi entrée à 15€</strong> : 1440€ de cash prize
              <ul className="ml-4">
                <li>1er : 1440€ x 60% = <strong>864€</strong> (soit <strong>288€</strong> par joueur)</li>
                <li>2e : 1440€ x 30% = <strong>432€</strong> (soit <strong>144€</strong> par joueur)</li>
                <li>3e : 1440€ x 10% = <strong>144€</strong> (soit <strong>48€</strong> par joueur)</li>
              </ul>
            </li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 text-indigo-400">Règlement</h3>
          <ul className="list-disc ml-6 text-gray-300 mb-6">
            <li><strong>Streaming Obligatoire</strong> : Les joueurs <strong>NE SONT PAS AUTORISÉS</strong> à diffuser sur des pages alternatives. Le streaming doit être fait sur leur compte principal.</li>
            <li><strong>Lien de stream</strong> : Fournissez le lien correct lorsque vous vous inscrivez. La diffusion sur une autre chaîne doit être autorisée par le personnel administratif.</li>
            <li><strong>Politique anti-triche stricte</strong>.</li>
            <li><strong>Streaming obligatoire</strong> pour <strong>TOUS LES JOUEURS PC</strong>. La VOD doit être publique.</li>
            <li><strong>Rapport de tous les matchs</strong> : Tous les concurrents doivent terminer les matchs dans les customs et fournir une preuve de diffusion appropriée.</li>
            <li><strong>Sanctions pour abandon</strong> : Quitter en plein tournoi entraîne une pénalité de <strong>-5€</strong>. Les sanctions peuvent augmenter pour les récidivistes.</li>
            <li><strong>Conséquences pour sabotage</strong> : Les événements de sabotage auront des conséquences graves.</li>
            <li><strong>Objets interdits</strong> : L'utilisation de tout objet interdit entraîne <strong>0 élimination</strong> comptée dans le classement.</li>
            <li><strong>Délai de diffusion</strong> : Un délai de diffusion est recommandé aux concurrents lors des customs.</li>
            <li><strong>Caméras faciales</strong> : Sur demande de l'administrateur, des caméras de surveillance peuvent être requises. Contactez le support pour signaler toute personne suspectée de tricherie.</li>
            <li><strong>Règles Customs Strive</strong> : Les règles douanières SPRIVE sont interdites.</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 text-indigo-400">Gameplay</h3>
          <ul className="list-disc ml-6 text-gray-300 mb-6">
            <li><strong>Pénalités pour abandon</strong> : Des pénalités seront appliquées pour avoir quitté le lobby avant d'avoir terminé tous les matchs.</li>
          </ul>

          <h4 className="text-lg font-semibold mb-2 text-indigo-300">Coupure</h4>
          <ul className="list-disc ml-6 text-gray-300 mb-6">
            <li><strong>Déconnexions</strong> : Le match ne sera pas réinitialisé tant que <strong>plus de 3 joueurs</strong> ne seront pas déconnectés avec une preuve appropriée.</li>
            <li><strong>Retard</strong> : Le match ne sera pas réinitialisé tant que <strong>plus de 9 joueurs</strong> ne seront pas en retard sans signaler ce problème au support administratif.</li>
            <li><strong>Serveurs plantés</strong> : Le jeu sera réinitialisé si les serveurs tombent complètement en panne, mais ne sera pas réinitialisé pour des pics de décalage mineurs.</li>
          </ul>

          <h4 className="text-lg font-semibold mb-2 text-indigo-300">Notation</h4>
          <ul className="list-disc ml-6 text-gray-300 mb-6">
            <li>Chaque élimination comptera pour un point dans le classement. Des multiplicateurs/points seront ajoutés en fonction du classement final.</li>
            <li><strong>Critères de départage</strong> : En cas d'égalité, l'équipe avec le score combiné le plus élevé sera déclarée gagnante.</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 text-indigo-400">Soutien</h3>
          <ul className="list-disc ml-6 text-gray-300 mb-6">
            <li><strong>Communications d'urgence</strong> : Utilisez Discord pour les communications d'urgence. Taguez <strong>@Admin</strong> sur le serveur Discord de Strive pour toute assistance.</li>
            <li><strong>Contact des administrateurs</strong> : Veuillez lire toutes les règles avant de contacter le support administratif et de poser vos questions de manière respectueuse.</li>
          </ul>
        </div>

        {/* Le bouton de fermeture fixe */}
        <div className="modal-footer absolute bottom-0 left-0 right-0 p-4 bg-gray-900">
          <button
            onClick={onClose}
            className="w-full text-white bg-gradient-to-r from-purple-600 to-indigo-500 px-4 py-2 rounded-full hover:from-indigo-500 hover:to-purple-600 transition duration-300 ease-in-out"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
