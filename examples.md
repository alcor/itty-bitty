python3 recipe.py 'https://cooking.nytimes.com/recipes/1018528-beef-bourguignon?ds_c=71700000052595478&gclsrc=aw.ds&gclid=CjwKCAiA_omPBhBBEiwAcg7smQNAgql0GZI6jHNtk_ApTTjTSN7ePEn8Iq7H2ivxIVKM-aw3zlobwhoCnUQQAvD_BwE' | brotli | openssl enc -aes-256-cbc  | base64 |  xargs -0 printf "http://localhost/#/data:application/ld+json;archive=brotli;cipher=aes;brot64,%s\n" | xargs open



# Encrypt STDIN and provide a password(prompt)
echo "message" | openssl enc -aes-256-cbc -a

# Decrypt STDIN and provide a password(prompt)
echo "encrypted" | openssl enc -aes-256-cbc -a -d