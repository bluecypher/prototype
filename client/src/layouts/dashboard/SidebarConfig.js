import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import shoppingBagFill from '@iconify/icons-eva/shopping-bag-fill';
import fileTextFill from '@iconify/icons-eva/file-text-fill';
import lockFill from '@iconify/icons-eva/lock-fill';
import personAddFill from '@iconify/icons-eva/person-add-fill';
import alertTriangleFill from '@iconify/icons-eva/alert-triangle-fill';


// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon(pieChart2Fill)
  },
  {
    title: 'My Team',
    path: '/dashboard/user',
    icon: getIcon(peopleFill)
  },
  {
    title: 'Customers',
    path: '/dashboard/customers',
    icon: getIcon(shoppingBagFill)
  },
  // {
  //   title: 'blog',
  //   path: '/dashboard/blog',
  //   icon: getIcon(fileTextFill)
  // },
  {
    title: 'login',
    path: '/login',
    icon: getIcon(lockFill)
  },
  {
    title: 'Edit Profile',
    path: '/register',
    icon: getIcon(personAddFill)
  },
  {
    title: "Today's Work",
    path: '/dashboard/todaysWork',
    icon: getIcon(personAddFill)
  },
  {
    title: 'Till Day Work',
    path: '/dashboard/tillDaysWork',
    icon: getIcon(personAddFill)
  }
];

export default sidebarConfig;
