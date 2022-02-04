import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
// import shoppingBagFill from '@iconify/icons-eva/shopping-bag-fill';
// import fileTextFill from '@iconify/icons-eva/file-text-fill';
// import lockFill from '@iconify/icons-eva/lock-fill';
// import personAddFill from '@iconify/icons-eva/person-add-fill';
// import alertTriangleFill from '@iconify/icons-eva/alert-triangle-fill';
// import customer from '@iconify/ant-design-icons/raphael:customer';




// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/work',
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
    icon: getIcon("raphael:customer")
  },
  // {
  //   title: 'blog',
  //   path: '/dashboard/blog',
  //   icon: getIcon(fileTextFill)
  // },
  
  {
    title: 'Edit Profile',
    path: '/register',
    icon: getIcon("clarity:note-edit-line" )
  },
  {
    title: "Today's Work",
    path: '/dashboard/todaysWork',
    icon: getIcon("ic:outline-work")
  },
  {
    title: 'Till Day Work',
    path: '/dashboard/tillDaysWork',
    icon: getIcon("bytesize:work")
  },
  {
    title: 'logout',
    path: '/sessionExpired',
    icon: getIcon("ri:logout-box-line")
  },
];

export default sidebarConfig;
