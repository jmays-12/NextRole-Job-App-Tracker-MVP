export const theme = {};
// initialize theme object first so we can inherit from other components
theme.page = `min-h-screen bg-slate-50 relative overflow-hidden`

theme.container = `max-w-xl mx-auto p-4 m-10 `
theme.header = `flex items-center gap-3`
theme.title = `text-2xl font-bold mb-3`
theme.tagline = `text-sm pb-2`
theme.username = `italic underline pt-2`

theme.card = `border rounded p-3 mb-3`

theme.buttonHover = `hover:bg-gray-200`
theme.button = `${theme.buttonHover} border rounded px-3 py-1 m-1 `
theme.buttonDanger = `${theme.button} text-red-600 hover:bg-red-100`

theme.logoutButton = `${theme.button}`
theme.editButtons = `ml-auto flex gap-3`

theme.error = `text-red-600 mb-2`
theme.row = `flex gap-2 items-center`
theme.link = `underline cursor-pointer`

theme.userControls = `ml-auto flex gap-3`
theme.companyName = `capitalize underline text-lg`
theme.notes = `italic`

theme.input = `border rounded p-1 w-full mb-2`
theme.dropdown = `border rounded px-3 py-1 bg-white cursor-pointer`