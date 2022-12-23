ARG BASE_IMAGE_TAG
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:${BASE_IMAGE_TAG}

ARG USERNAME=node

# Ensure vscode server is owned by the user
RUN mkdir -p /home/$USERNAME/.vscode-server/extensions /home/$USERNAME/.vscode-server-insiders/extensions && \
    chown -R $USERNAME /home/$USERNAME/.vscode-server /home/$USERNAME/.vscode-server-insiders

# Persist bash history between runs
RUN SNIPPET="export PROMPT_COMMAND='history -a' && export HISTFILE=/commandhistory/.bash_history" \
    && mkdir /commandhistory \
    && touch /commandhistory/.bash_history \
    && chown -R $USERNAME /commandhistory \
    && echo "$SNIPPET" >> "/home/$USERNAME/.bashrc"
    
# Install Nerd Font
RUN mkdir -p /home/$USERNAME/.local/share/fonts && \
    apt-get update && apt-get install -y fontconfig && \
    wget -P /tmp https://github.com/ryanoasis/nerd-fonts/releases/download/v2.2.2/FiraCode.zip && \
    unzip /tmp/FiraCode.zip -d /home/$USERNAME/.local/share/fonts && \
    chown -R $USERNAME /home/$USERNAME/.local && \
    fc-cache -fv && \
    rm -rf /tmp/*

# Install Starship.rs
RUN curl -sS https://starship.rs/install.sh | sh -s -- --yes
RUN echo 'eval "$(starship init bash)"' >> /home/$USERNAME/.bashrc

# Fix ownership of .aws directory
RUN mkdir /home/$USERNAME/.aws && \
    chown -R $USERNAME /home/$USERNAME/.aws

# Enabled running workspace installed node bins
RUN echo "export PATH=$PATH:./node_modules/.bin" >> "/home/$USERNAME/.bashrc"