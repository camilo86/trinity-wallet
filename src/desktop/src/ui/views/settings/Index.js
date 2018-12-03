import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, Switch, Route, Redirect } from 'react-router-dom';
import { withI18n } from 'react-i18next';
import { connect } from 'react-redux';

import Icon from 'ui/components/Icon';

import Language from 'ui/views/settings/Language';
import Theme from 'ui/views/settings/Theme';
import SetNode from 'ui/views/settings/Node';
import Currency from 'ui/views/settings/Currency';
import Password from 'ui/views/settings/Password';
import Mode from 'ui/views/settings/Mode';
import Advanced from 'ui/views/settings/Advanced';
import TwoFA from 'ui/views/settings/TwoFA';

import AccountName from 'ui/views/settings/account/Name';
import AccountSeed from 'ui/views/settings/account/Seed';
import AccountAddresses from 'ui/views/settings/account/Addresses';
import AccountTools from 'ui/views/settings/account/Tools';
import AccountRemove from 'ui/views/settings/account/Remove';

import css from './index.scss';

/**
 * Settings wrapper component
 **/
class Settings extends React.PureComponent {
    static propTypes = {
        /** @ignore */
        accounts: PropTypes.object,
        /** @ignore */
        wallet: PropTypes.object,
        /** @ignore */
        location: PropTypes.object,
        /** @ignore */
        history: PropTypes.shape({
            push: PropTypes.func.isRequired,
        }).isRequired,
        /** @ignore */
        t: PropTypes.func.isRequired,
    };

    render() {
        const { accounts, location, wallet, history, t } = this.props;
        const { accountIndex } = this.props.match.params;

        const backRoute = wallet.ready ? '/wallet/' : '/onboarding/';

        const accountSettings = typeof accountIndex === 'string';
        const accountNames = Object.keys(accounts);

        const account = accountSettings
            ? { ...accounts[accountNames[accountIndex]], ...{ accountName: accountNames[accountIndex], accountIndex } }
            : null;

        return (
            <main className={css.settings}>
                <aside>
                    <NavLink to="/settings/">Trinity settings</NavLink>
                    {!accountSettings && (
                        <nav>
                            <NavLink to="/settings/language">
                                <Icon icon="language" size={16} /> <strong>{t('settings:language')}</strong>
                            </NavLink>
                            <NavLink to="/settings/node">
                                <Icon icon="node" size={16} /> <strong>{t('node')}</strong>
                            </NavLink>
                            <NavLink to="/settings/theme">
                                <Icon icon="theme" size={16} /> <strong>{t('settings:theme')}</strong>
                            </NavLink>
                            <NavLink to="/settings/currency">
                                <Icon icon="currency" size={16} /> <strong>{t('settings:currency')}</strong>
                            </NavLink>
                            {wallet.ready && (
                                <div>
                                    <hr />
                                    <NavLink to="/settings/password">
                                        <Icon icon="password" size={16} />{' '}
                                        <strong>{t('settings:changePassword')}</strong>
                                    </NavLink>
                                    <NavLink to="/settings/twoFa">
                                        <Icon icon="twoFA" size={16} /> <strong>{t('settings:twoFA')}</strong>
                                    </NavLink>
                                    <hr />
                                    <NavLink to="/settings/mode">
                                        <Icon icon="mode" size={16} /> <strong>{t('settings:mode')}</strong>
                                    </NavLink>
                                </div>
                            )}
                            <NavLink to="/settings/advanced">
                                <Icon icon="advanced" size={16} /> <strong>{t('settings:advanced')}</strong>
                            </NavLink>
                        </nav>
                    )}
                    {wallet.ready &&
                        accountNames.map((account, index) => {
                            return (
                                <React.Fragment key={`account-${index}`}>
                                    <NavLink to={`/settings/account/name/${index}`}>{account}</NavLink>
                                    {accountIndex === String(index) && (
                                        <nav>
                                            <NavLink to={`/settings/account/name/${accountIndex}`}>
                                                <Icon icon="user" size={20} />{' '}
                                                <strong>{t('addAdditionalSeed:accountName')}</strong>
                                            </NavLink>
                                            <NavLink to={`/settings/account/seed/${accountIndex}`}>
                                                <Icon icon="eye" size={20} />{' '}
                                                <strong>{t('accountManagement:viewSeed')}</strong>
                                            </NavLink>
                                            <NavLink to={`/settings/account/addresses/${accountIndex}`}>
                                                <Icon icon="bookmark" size={20} />{' '}
                                                <strong>{t('accountManagement:viewAddresses')}</strong>
                                            </NavLink>
                                            <hr />
                                            <NavLink to={`/settings/account/tools/${accountIndex}`}>
                                                <Icon icon="settingsAlt" size={20} />{' '}
                                                <strong>{t('accountManagement:tools')}</strong>
                                            </NavLink>
                                            {accountNames.length > 1 ? (
                                                <React.Fragment>
                                                    <hr />
                                                    <NavLink to={`/settings/account/remove/${accountIndex}`}>
                                                        <Icon icon="trash" size={20} />{' '}
                                                        <strong>{t('accountManagement:deleteAccount')}</strong>
                                                    </NavLink>
                                                </React.Fragment>
                                            ) : null}
                                        </nav>
                                    )}
                                </React.Fragment>
                            );
                        })}
                </aside>
                <section className={css.content}>
                    <header>
                        <a onClick={() => history.push(backRoute)}>
                            <Icon icon="cross" size={24} />
                        </a>
                    </header>
                    <div>
                        <Switch location={location}>
                            <Route path="/settings/language" component={Language} />
                            <Route path="/settings/theme" component={Theme} />
                            <Route path="/settings/node" component={SetNode} />
                            <Route path="/settings/currency" component={Currency} />
                            <Route path="/settings/password" component={Password} />
                            <Route path="/settings/twoFa" component={TwoFA} />
                            <Route path="/settings/mode" component={Mode} />
                            <Route path="/settings/advanced" component={Advanced} />
                            <Route
                                path="/settings/account/name/:accountIndex"
                                render={() => <AccountName account={account} />}
                            />
                            <Route
                                path="/settings/account/seed/:accountIndex"
                                render={() => <AccountSeed account={account} />}
                            />
                            <Route
                                path="/settings/account/addresses/:accountIndex"
                                render={() => <AccountAddresses account={account} />}
                            />
                            <Route
                                path="/settings/account/tools/:accountIndex"
                                render={() => <AccountTools account={account} />}
                            />
                            <Route
                                path="/settings/account/remove/:accountIndex"
                                render={() => <AccountRemove history={history} account={account} />}
                            />
                            <Redirect from="/settings/" to="/settings/language" />
                        </Switch>
                    </div>
                </section>
            </main>
        );
    }
}

const mapStateToProps = (state) => ({
    accounts: state.accounts.accountInfo,
    wallet: state.wallet,
});

export default connect(mapStateToProps)(withI18n()(Settings));
