// -- copyright
// OpenProject is an open source project management software.
// Copyright (C) 2012-2020 the OpenProject GmbH
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2013 Jean-Philippe Lang
// Copyright (C) 2010-2013 the ChiliProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
// See docs/COPYRIGHT.rdoc for more details.
// ++

import {StateService} from '@uirouter/core';
import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {I18nService} from "core-app/modules/common/i18n/i18n.service";
import {CurrentProjectService} from "core-components/projects/current-project.service";
import {AuthorisationService} from "core-app/modules/common/model-auth/model-auth.service";
import {componentDestroyed} from "ng2-rx-componentdestroyed";

@Component({
  selector: 'wp-create-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './wp-create-button.html'
})
export class WorkPackageCreateButtonComponent implements OnInit, OnDestroy {
  @Input('allowed') allowedWhen:string[];
  @Input('stateName') stateName:string;

  allowed:boolean;
  projectIdentifier:string|null;
  types:any;

  text = {
    createWithDropdown: this.I18n.t('js.work_packages.create.button'),
    createButton: this.I18n.t('js.label_work_package'),
    explanation: this.I18n.t('js.label_create_work_package')
  };

  constructor(readonly $state:StateService,
              readonly currentProject:CurrentProjectService,
              readonly authorisationService:AuthorisationService,
              readonly I18n:I18nService) {
  }

  ngOnInit() {
    this.projectIdentifier = this.currentProject.identifier;
    // Created for interface compliance

    // Find the first permission that is allowed
    this.authorisationService
      .observeUntil(componentDestroyed(this))
      .subscribe(() => {
        this.allowed = !!this
          .allowedWhen
          .find(combined => {
            let [module, permission] = combined.split('.');
            return this.authorisationService.can(module, permission);
          });
      });
  }

  ngOnDestroy():void {
    // Nothing to do
  }

  createWorkPackage() {
    this.$state.go(this.stateName, {projectPath: this.projectIdentifier});
  }

  isDisabled() {
    return !this.allowed || this.$state.includes('**.new');
  }
}
