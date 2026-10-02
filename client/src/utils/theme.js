export const theme = {};
// initialize empty theme object first so we can inherit from other components
theme.page = `min-h-screen bg-slate-50 relative overflow-hidden`

theme.container = `max-w-2xl mx-auto p-4 m-10 `
theme.header = `flex items-center gap-3`
theme.title = `text-2xl font-bold mb-3`
theme.tagline = `pb-2 ml-auto`
theme.username = `italic underline pt-2`

theme.card = `border rounded p-3 mb-3`

theme.helpButton = `border rounded-full w-6 h-6 flex items-center justify-center cursor-help mt-2 bg-white`
theme.helpPopup = `text-center absolute right-0 top-9 z-50 w-80 rounded border bg-white p-2 shadow-lg text-sm text-gray-700`
theme.helpPopupTitle = `text-lg`
theme.helpClose = `absolute top-2 right-2 text-gray-500 hover:text-gray-800 cursor-pointer text-sm`

theme.buttonHover = `hover:bg-gray-200`

theme.button = `${theme.buttonHover} border rounded-lg px-2 py-0.5 m-1 `
theme.buttonDanger = `${theme.button} text-red-600 hover:bg-red-100`
theme.logoutButton = `${theme.button}`
theme.editButtons = `ml-auto flex gap-3`

theme.statusRow = `flex flex-wrap gap-2 mt-3`
theme.chipBase = `border rounded-full px-3 py-1 text-sm capitalize cursor-pointer`
theme.chipOff = `${theme.chipBase} text-gray-500 hover:bg-gray-100`
theme.chipOn = {
    applied: `${theme.chipBase} bg-blue-100 text-blue-800 border-blue-300`,
    interviewing: `${theme.chipBase} bg-yellow-100 text-yellow-800 border-yellow-300`,
    offer: `${theme.chipBase} bg-green-100 text-green-800 border-green-300`,
    rejected: `${theme.chipBase} bg-red-100 text-red-800 border-red-300`,
    withdrawn: `${theme.chipBase} bg-gray-200 text-gray-700 border-gray-400`,
}


theme.userControls = `ml-auto flex gap-3`
theme.companyName = `capitalize underline text-xl m-1`
theme.role = `text-gray-800 m-1 block`
// theme.notes = `border rounded border-gray-500 p-2 bg-amber-50 text-sm text-gray-500 m-1 whitespace-pre-line`
theme.notes = `border rounded border-gray-500 p-2 bg-[repeating-linear-gradient(to_bottom,#fffbeb_0px,#fffbeb_27px,#fde68a_28px)] text-sm text-gray-600 m-1 whitespace-pre-line leading-4`
theme.notesTitle = `text-base block m-1 text-gray-600`
theme.appLink = `underline text-blue-500 text-sm block m-1`
theme.date = `text-sm text-gray-600 m-1`


theme.input = `border rounded p-1 w-full mb-2`


theme.switchText = `mt-3`
theme.error = `text-red-600 mb-2`
theme.row = `flex gap-2 items-center`
theme.link = `underline cursor-pointer`
theme.info = `text-center mt-10 text-gray-500`