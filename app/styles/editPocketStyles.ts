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
    paddingHorizontal: 20,
    paddingVertical: 18,
    justifyContent: 'space-between',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: PRIMARY,
  },

  /* ====================
     TABLE HEADER
  ==================== */
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#eef3f2',
  },

  columnLeft: {
    flex: 1,
    fontSize: 13,
    color: '#6c7c7c',
  },

  columnRight: {
    width: 120,
    fontSize: 13,
    color: '#6c7c7c',
    textAlign: 'left',
  },

  /* ====================
     ROWS
  ==================== */
  row: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },

  pocketName: {
    flex: 1,
    fontSize: 14,
    color: '#111',
  },

  amountCell: {
    width: 120,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
  },

  /* ====================
     MODALS
  ==================== */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },

  modalSheet: {
    backgroundColor: '#fff',
    padding: 20,
    paddingBottom: 28,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 18,
    color: '#111',
  },

  /* ====================
     INPUTS
  ==================== */
  inputLabel: {
    fontSize: 12,
    color: '#6c7c7c',
    marginBottom: 6,
    marginTop: 10,
  },

  textInput: {
    borderWidth: 1,
    borderColor: '#e3e3e3',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: '#fff',
  },

  /* ====================
     INFO / WARNING BOXES
  ==================== */
  infoBox: {
    backgroundColor: '#f7f7f7',
    padding: 14,
    borderRadius: 12,
  },

  infoText: {
    fontSize: 13,
    color: '#444',
    lineHeight: 18,
  },

  warningBox: {
    backgroundColor: '#f7f7f7',
    padding: 14,
    borderRadius: 12,
  },

  warningText: {
    fontSize: 13,
    color: '#444',
    lineHeight: 18,
  },

  /* ====================
     MODAL ACTIONS
  ==================== */
  modalActions: {
    flexDirection: 'row',
    marginTop: 22,
    gap: 12,
  },

  cancelButton: {
    flex: 1,
    backgroundColor: '#e7eeee',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
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
    borderRadius: 14,
    alignItems: 'center',
  },

  confirmText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
