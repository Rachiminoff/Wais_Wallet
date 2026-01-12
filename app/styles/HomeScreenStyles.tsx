import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  // ====================
  // MAIN CONTAINERS
  // ====================
  safeArea: {
    flex: 1,
    backgroundColor: '#e6e6e6',
  },
  container: {
    flex: 1,
    backgroundColor: '#e6e6e6',
  },

  // ====================
  // LOADING STATE
  // ====================
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },

  // ====================
  // GRADIENT BALANCE CARD (#528d94 gradient)
  // ====================
  gradientBalanceCard: {
    marginBottom: 20,
    overflow: 'hidden',
    borderTopLeftRadius: 0, // Sharp top corners
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 34, // Rounded bottom corners
    borderBottomRightRadius: 34,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  gradientBalanceCardInner: {
    padding: 45,
    // Background color will be set by LinearGradient component
  },
  
  // Sharp top extension
  topExtension: {
    position: 'absolute',
    top: -100, // Extends above the card
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: '#528d94',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  // Card header with profile picture
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    paddingBottom: 20,
  },
  profileImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  profileImagePlaceholder: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileTextContainer: {
    flex: 1,
  },
  cardGreeting: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  cardEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },

  // ====================
  // SAFE BALANCE - LEFT ALIGNED, BIG FONT
  // ====================
  safeBalanceSection: {
    alignItems: 'flex-start',
    marginBottom: 25,
  },
  safeBalanceLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 6,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  safeBalanceAmount: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  // ====================
  // TOTAL BALANCE - LEFT ALIGNED, SMALLER FONT
  // ====================
  totalBalanceSection: {
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  totalBalanceLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 6,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  totalBalanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  totalBalanceAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginRight: 12,
  },
  eyeIconButton: {
    padding: 4,
  },
  dotsContainer: {
    height: 40,
    justifyContent: 'center',
    marginRight: 12,
  },
  dotsText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 4,
  },
  totalBalanceHint: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    fontStyle: 'italic',
  },

  // ====================
  // ACTION BUTTONS
  // ====================
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20, // spacing between buttons
  },
  addFundsButton: {
    flex: 1,
    backgroundColor: '#D3D3D3', // light gray
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  transferFundsButton: {
    flex: 1,
    backgroundColor: '#D3D3D3', // light gray
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  addFundsButtonText: {
    color: '#000', // black text for contrast
    fontSize: 16,
    fontWeight: '700',
  },
  transferFundsButtonText: {
    color: '#000', // black text for contrast
    fontSize: 16,
    fontWeight: '700',
  },

  // ====================
  // POCKETS SECTION
  // ====================
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: 0.3,
    marginBottom: 24,
  },

  // POCKETS LIST
  pocketsList: {
    backgroundColor: '#F8F9FA',
    borderRadius: 24, // increased from 16 for more rounded corners
    overflow: 'hidden',
    borderWidth: 0,
    marginHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  // POCKET ROW
  pocketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderBottomWidth: 0,
    backgroundColor: '#FFFFFF',
  },
  pocketRowLast: {
    borderBottomWidth: 0,
  },
  pocketName: {
    fontSize: 17,
    color: '#212529',
    flex: 1,
  },
  pocketAmount: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1a374a',
  },

  // ====================
  // BOTTOM NAVBAR
  // ====================
  bottomNavbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 14,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  navIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  navItemText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  navItemTextActive: {
    fontSize: 12,
    color: '#007AFF',
  }
});

export default styles;