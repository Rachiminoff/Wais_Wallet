import { StyleSheet } from 'react-native';

const PRIMARY = '#0f3d3e';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },

  backButton: {
    marginBottom: 20,
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

  formGroup: {
    marginBottom: 20,
  },

  label: {
    fontSize: 13,
    color: '#7a8a8a',
    marginBottom: 6,
  },

  input: {
    backgroundColor: '#f3f6f6',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: '#000',
  },

  amountInput: {
    opacity: 0.85,
  },

  continueButton: {
    backgroundColor: PRIMARY,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  continueText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },

  /* MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },

  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },

  confirmCard: {
    backgroundColor: '#f6f7f7',
    borderRadius: 12,
    padding: 16,
  },

  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  confirmLabel: {
    fontSize: 13,
    color: '#6f7f7f',
  },

  confirmValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },

  modalActions: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 12,
  },

  backModalButton: {
    flex: 1,
    backgroundColor: '#e7eeee',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  backModalText: {
    color: PRIMARY,
    fontWeight: '600',
  },

  confirmModalButton: {
    flex: 1,
    backgroundColor: PRIMARY,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  confirmModalText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default styles;
