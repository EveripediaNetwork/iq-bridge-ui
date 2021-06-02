```
 /$$                 /$$       /$$                    
| $$                |__/      | $$                    
| $$$$$$$   /$$$$$$  /$$  /$$$$$$$  /$$$$$$   /$$$$$$ 
| $$__  $$ /$$__  $$| $$ /$$__  $$ /$$__  $$ /$$__  $$
| $$  \ $$| $$  \__/| $$| $$  | $$| $$  \ $$| $$$$$$$$
| $$  | $$| $$      | $$| $$  | $$| $$  | $$| $$_____/
| $$$$$$$/| $$      | $$|  $$$$$$$|  $$$$$$$|  $$$$$$$
|_______/ |__/      |__/ \_______/ \____  $$ \_______/
                                   /$$  \ $$          
                                  |  $$$$$$/          
                                   \______/            
```

## Install:

```bash
cp .env.template .env.dev
yarn
yarn start
```

## Develop using testnet:

If you want to develop using Goerli, you can uncomment goerli env variables in .env.template. 
If you need to mint mocked pTokens in Goerli you can go to https://goerli.etherscan.io/address/0xbff1365cf0a67431484c00c63bf14cfd9abbce5d#writeContract and use mint function
