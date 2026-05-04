import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { 
  ChevronRight, 
  CreditCard, 
  MessageSquare, 
  CalendarClock, 
  LayoutGrid,
  X,
  ShieldCheck,
  HelpCircle,
  Settings
} from 'lucide-react-native';

export default function MenuScreen() {
  const router = useRouter();

  const menuSections = [
    {
      title: 'Services',
      items: [
        { icon: <LayoutGrid size={20} color={COLORS.champagneGold} />, label: 'Categories', onPress: () => router.push('/customer/items') },
        { icon: <CreditCard size={20} color={COLORS.champagneGold} />, label: 'Payments', onPress: () => router.push('/customer/payments') },
        { icon: <CalendarClock size={20} color={COLORS.champagneGold} />, label: 'Visitors', onPress: () => router.push('/customer/visitors') },
        { icon: <MessageSquare size={20} color={COLORS.champagneGold} />, label: 'Complaints', onPress: () => router.push('/customer/complaints') },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: <HelpCircle size={20} color={COLORS.champagneGold} />, label: 'FAQ', onPress: () => {} },
        { icon: <ShieldCheck size={20} color={COLORS.champagneGold} />, label: 'Privacy Policy', onPress: () => {} },
      ]
    },
    {
      title: 'App Settings',
      items: [
        { icon: <Settings size={20} color={COLORS.champagneGold} />, label: 'Preferences', onPress: () => {} },
      ]
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Menu</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <X size={24} color={COLORS.deepCharcoal} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {menuSections.map((section, idx) => (
          <View key={idx} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.card}>
              {section.items.map((item, itemIdx) => (
                <TouchableOpacity 
                  key={itemIdx} 
                  style={[styles.menuItem, itemIdx === section.items.length - 1 && styles.lastItem]} 
                  onPress={item.onPress}
                >
                  <View style={styles.iconBox}>{item.icon}</View>
                  <Text style={styles.label}>{item.label}</Text>
                  <ChevronRight size={18} color={COLORS.lightGrey} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.softIvory,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: COLORS.deepCharcoal,
  },
  closeBtn: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: COLORS.darkGrey,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: COLORS.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.softIvory,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.champagneGold + '12',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  label: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600' as const,
    color: COLORS.deepCharcoal,
  },
});
