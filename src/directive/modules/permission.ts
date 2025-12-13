// import { DirectiveBinding } from 'vue'
// import useUserStore from '../../store/user'

// function checkPermission(el: HTMLElement, binding: DirectiveBinding) {
//   const { value } = binding
//   const userStore = useUserStore()
//   const permissions = userStore.getPermissions
//   if (permissions.length > 0 && !permissions.includes(value)) {
//     el.style.display = 'none'
//   } else {
//     el.style.display = 'flex'
//   }
// }
//
// export default {
//   mounted(el: HTMLElement, binding: DirectiveBinding) {
//     checkPermission(el, binding)
//   },
//   updated(el: HTMLElement, binding: DirectiveBinding) {
//     checkPermission(el, binding)
//   },
// }
