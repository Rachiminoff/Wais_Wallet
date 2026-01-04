import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  /* =====================
     LAYOUT
  ===================== */

  safeArea: {
    flex: 1,
    backgroundColor: '#F2F3F5',
  },

  /* =====================
     HEADER
  ===================== */

  forestHeaderContainer: {
    position: 'relative',
    width: '100%',
    height: 360,
  },

  forestImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  forestHeader: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  largeProfileImageContainer: {
    width: 104,
    height: 104,
    borderRadius: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 6,
  },

  largeProfileImageText: {
    fontSize: 42,
    fontWeight: '800',
  },

  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },

  /* =====================
     PROFILE SECTION
  ===================== */

  profileSection: {
    marginTop: -48,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    padding: 22,
    paddingBottom: 160,
    elevation: 12,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: 26,
    marginBottom: 10,
    opacity: 0.6,
  },

  /* =====================
     OPTION ROWS
  ===================== */

  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E3E4E8',
  },

  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
  },

  /* =====================
     TOGGLE
  ===================== */

  toggleSwitch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    padding: 3,
    backgroundColor: '#D1D1D6',
    justifyContent: 'center',
  },

  toggleKnob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
    elevation: 3,
  },

  /* =====================
     INPUTS
  ===================== */

  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#D1D5DB', // ✅ FIX: border was missing
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 14,
  },

  /* =====================
     BUTTONS
  ===================== */

  primaryButton: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: '#0D6EFD',
    marginTop: 6,
  },

  primaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },

  logoutButton: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    backgroundColor: '#DC3545',
  },

  logoutButtonText: {
    fontSize: 17,
    fontWeight: '700',
    marginLeft: 10,
    color: '#fff',
  },

  /* =====================
     DANGER ZONE
  ===================== */

  dangerZone: {
    marginTop: 32,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F5C2C7',
    backgroundColor: '#FFF5F5',
  },

  dangerZoneTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#B02A37',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },

  dangerZoneDescription: {
    fontSize: 14,
    color: '#842029',
    marginBottom: 14,
    lineHeight: 20,
  },

  dangerZoneButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DC3545',
  },

  dangerZoneButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC3545',
  },

  /* =====================
     MODAL
  ===================== */

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  modalBox: {
    width: '100%',
    borderRadius: 24,
    padding: 24,
    elevation: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 14,
    textAlign: 'center',
  },

  modalCancel: {
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#828282e0',
    alignItems: 'center',
    marginTop: 8,
  },

  modalCancelText: {
    fontSize: 15,
    fontWeight: '700',
  },

  /* =====================
     ERROR / SUCCESS
  ===================== */

  errorText: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginVertical: 10,
  },

  successText: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginVertical: 10,
  },
});

