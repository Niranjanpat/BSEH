import { StyleSheet } from "react-native";
import { SPACINGS, TYPOGRAPHY } from "../../../../constants/theme";
import { COLORS } from "../../../../constants/theme/colors";

export const orderStyles = StyleSheet.create({
    contentContainerStyle: {
      padding: SPACINGS.md,
      paddingTop: SPACINGS.xs,
    },
  
    heading: {
      paddingBottom: 0,
      padding: SPACINGS.md,
    },

    subheading: {...TYPOGRAPHY.body1},

    header: {...TYPOGRAPHY.body1, textAlign: 'center'},
  
    customer: {
      borderRadius: 5,
      padding: SPACINGS.xs,
      backgroundColor: COLORS.light,
    },
  
    list: {
      marginBottom: 10,
      borderRadius: 10,
      backgroundColor: '#fff',
    },
  
    itemsCount: {
      alignSelf: 'center',
      padding: SPACINGS.sm,
      backgroundColor: COLORS.secondary,
    },
  
    grandTotalContainer: {
      borderTopWidth: 0.4,
      padding: SPACINGS.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: COLORS.light,
      borderTopColor: COLORS.lightGrey,
    },
  
    buttonRow: {
      margin: 15,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
  });