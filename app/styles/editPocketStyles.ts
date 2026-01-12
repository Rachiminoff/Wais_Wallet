import { StyleSheet } from 'react-native';

const PRIMARY = '#0f3d3e';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },

  /* ====================
     HEADER
  ==================== */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    justifyContent: 'space-between',
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: PRIMARY,
  },

  divider: {
    height: 1,
    marginHorizontal: 20,
    backgroundColor: '#E5E7EB',
    marginBottom: 20,
  },

  /* ====================
     TABLE HEADER
  ==================== */
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#f8f9f9',
    marginBottom: 2,
  },

  columnLeft: {
    flex: 1,
    fontSize: 12,
    color: '#9AA0A6',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  columnRight: {
    width: 120,
    fontSize: 12,
    color: '#9AA0A6',
    textAlign: 'left',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  /* ====================
     ROWS
  ==================== */
  row: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginHorizontal: 8,
    marginVertical: 6,
    borderRadius: 14,
    backgroundColor: '#fafbfb',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },

  pocketName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#111',
  },

  amountCell: {
    width: 140,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 18,
  },

  /* ====================
     MODALS
  ==================== */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalSheet: {
    backgroundColor: '#fff',
    padding: 20,
    paddingBottom: 28,
    borderRadius: 24,
    width: '85%',
    maxWidth: 400,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#111',
    lineHeight: 24,
  },

  /* ====================
     INPUTS
  ==================== */
  inputLabel: {
    fontSize: 13,
    color: '#6c7c7c',
    marginBottom: 8,
    marginTop: 14,
    fontWeight: '600',
  },

  textInput: {
    borderWidth: 1,
    borderColor: '#e3e3e3',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: '#fafbfb',
    fontWeight: '400',
  },

  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e3e3e3',
    borderRadius: 12,
    marginTop: 12,
    gap: 12,
  },

  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    marginBottom: 2,
  },

  /* ====================
     INFO / WARNING BOXES
  ==================== */
  infoBox: {
    backgroundColor: '#f5f7f7',
    padding: 14,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#0f4248',
    marginBottom: 12,
  },

  infoText: {
    fontSize: 13,
    color: '#444',
    lineHeight: 18,
    fontWeight: '400',
  },

  warningBox: {
    backgroundColor: '#fef9f5',
    padding: 14,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
    marginBottom: 12,
  },

  warningText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
    fontWeight: '400',
  },

  /* ====================
     MODAL ACTIONS
  ==================== */
  modalActions: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 10,
  },

  cancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },

  cancelText: {
    color: PRIMARY,
    fontWeight: '600',
    fontSize: 14,
  },

  confirmButton: {
    flex: 1,
    backgroundColor: PRIMARY,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  confirmText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
