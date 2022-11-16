# ToolboxMobileTest - React Native

Test Project to demostrate skills for and ToolBox company interview.

## Installation

1. Open Terminal
2. Clone a GitHub repository https://github.com/mcarlos137/ToolboxMobileTest.git in a ToolboxMobileTest folder in your workspace environment.
3. Go into ToolboxMobileTest folder
4. Run command 'npm install' (node required)
5. For IOS run 'cd ios && pod install && cd ..' 
6. For Android create file android/local.properties pointing your SDK like this: sdk.dir = /Users/$user/Library/Android/sdk

## Run (React Native CLI required) 

IOS: 'react-native run-ios' (if you want to specify simulator name use react-native run-ios --simulator="iPhone 14")
Android: 'react-native run-android' (open your simulator before run command) 

## Usage

Press Login button to go to carousels.
Navegate into carrousel Items and press image to deploy video player.
Inside video player press '<Back' button to return to carrousels. (this button checks if token is expired or not, and if it is expired, redirect to main screen)
Press Logout button to return to main screen.

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
