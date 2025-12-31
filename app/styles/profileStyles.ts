import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  /* =====================
     LAYOUT
  ===================== */

  safeArea: {
    flex: 1,
    backgroundColor: '#e6e6e6',
  },

  scrollContent: {
    flexGrow: 1,
  },

  /* =====================
     HEADER
  ===================== */

  forestHeaderContainer: {
    position: 'relative',
    width: '100%',
    height: 380,
  },

  forestImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  forestHeader: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },

  largeProfileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    elevation: 6,
  },

  largeProfileImageText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#000',
  },

  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },

  /* =====================
     PROFILE SECTION
  ===================== */

  profileSection: {
    marginTop: -40,
    backgroundColor: '#fff',
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    padding: 20,
    paddingBottom: 140,
    elevation: 10,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666',
    marginBottom: 12,
  },

  /* =====================
     OPTION ROWS
  ===================== */

  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },

  optionRowSection: {
    marginVertical: 18,
  },

  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },

  /* =====================
     TOGGLE SWITCH
  ===================== */

  toggleSwitch: {
    width: 52,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ccc',
    padding: 3,
  },

  toggleKnob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
    elevation: 3,
  },

  /* =====================
     RADIO BUTTONS
  ===================== */

  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginRight: 10,
  },

  radioCircleSelected: {
    backgroundColor: '#007AFF',
  },

  /* =====================
     INPUTS
  ===================== */

  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
  },

  /* =====================
     BUTTONS
  ===================== */

  primaryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 4,
  },

  primaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#DC3545',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
  },

  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 12,
  },

  /* =====================
     MODAL
  ===================== */

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  modalBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 22,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },

  dangerButton: {
    backgroundColor: '#FDECEC',
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 12,
    alignItems: 'center',
  },

  dangerText: {
    color: '#DC3545',
    fontSize: 15,
    fontWeight: '700',
  },

  modalCancel: {
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#EFEFF4',
    alignItems: 'center',
  },

  modalCancelText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },

  /* =====================
     NAV BAR
  ===================== */

  bottomNavbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },

  navItem: {
    alignItems: 'center',
    paddingVertical: 6,
  },

  navItemText: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },

  navItemTextActive: {
    fontSize: 12,
    color: '#007AFF',
  },
});
